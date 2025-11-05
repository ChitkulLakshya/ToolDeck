import express from "express";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import nodemailer from "nodemailer";
import fs from "fs";
import csv from "csv-parser";
import path from "path";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Email generation endpoint
router.post("/generate", upload.single("eventImage"), async (req, res) => {
  try {
    const { context } = req.body;
    const imagePath = req.file?.path;

    if (!context && !imagePath) {
      return res.status(400).json({ error: "Please provide context or image" });
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY not configured, using mock response");
      
      // Clean up uploaded file
      if (imagePath && fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
      
      // Return mock response
      return res.json({
        success: true,
        subject: `${context ? context.split('.')[0].substring(0, 50) : 'Your Event Invitation'}`,
        body: `Dear Team,

We are excited to invite you to our upcoming event!

${context || 'Join us for an amazing experience that you won\'t want to miss.'}

Event Details:
- Date: [Please add date]
- Time: [Please add time]
- Venue: [Please add venue]
- Registration: [Please add link]

We look forward to seeing you there!

Best regards,
The Event Team`
      });
    }

    // Initialize Gemini model
    // Using gemini-1.5-pro which is available in v1 API
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    let prompt = `You are a professional email writer for events and organizations. Generate a complete, professional email with the following:

Context: ${context}

Requirements:
1. Create an engaging subject line (max 50 characters)
2. Write a well-structured email body with:
   - Professional greeting
   - Clear introduction
   - Main content with key details
   - Call-to-action
   - Professional closing
3. Use appropriate tone (formal/casual based on context)
4. Keep it concise but informative
5. Include placeholders for specific details like dates, links, etc.

Return ONLY a JSON object with this exact structure:
{
  "subject": "your subject line here",
  "body": "your complete email body here"
}`;

    let result;
    
    if (imagePath) {
      // Read image and convert to base64
      const imageData = fs.readFileSync(imagePath);
      const base64Image = imageData.toString('base64');
      
      result = await model.generateContent([
        {
          inlineData: {
            mimeType: req.file.mimetype,
            data: base64Image
          }
        },
        prompt
      ]);
      
      // Clean up uploaded file
      fs.unlinkSync(imagePath);
    } else {
      result = await model.generateContent(prompt);
    }

    const responseText = result.response.text();
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid AI response format");
    }
    
    const emailData = JSON.parse(jsonMatch[0]);
    
    res.json({
      success: true,
      subject: emailData.subject,
      body: emailData.body
    });

  } catch (error) {
    console.error("Email generation error:", error);
    
    // Clean up uploaded file on error
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      error: "Failed to generate email",
      details: error.message 
    });
  }
});

// Email sending endpoint
router.post("/send", upload.fields([
  { name: 'csvFile', maxCount: 1 },
  { name: 'attachment0', maxCount: 1 },
  { name: 'attachment1', maxCount: 1 },
  { name: 'attachment2', maxCount: 1 },
  { name: 'attachment3', maxCount: 1 },
  { name: 'attachment4', maxCount: 1 }
]), async (req, res) => {
  try {
    const { 
      senderEmail, 
      senderName, 
      subject, 
      body, 
      sendMode,
      recipientEmail 
    } = req.body;

    // Validate inputs
    if (!senderEmail || !senderName || !subject || !body) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("Email credentials not configured");
      
      // Clean up uploaded files
      if (req.files) {
        Object.values(req.files).flat().forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }
      
      // Return mock success
      return res.json({
        success: true,
        message: `Mock: Email would be sent to ${sendMode === 'single' ? recipientEmail : 'multiple recipients'}`,
        successCount: sendMode === 'single' ? 1 : 10,
        failCount: 0
      });
    }

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Prepare attachments
    const attachments = [];
    if (req.files) {
      for (let i = 0; i < 5; i++) {
        const attachmentKey = `attachment${i}`;
        if (req.files[attachmentKey]) {
          const file = req.files[attachmentKey][0];
          attachments.push({
            filename: file.originalname,
            path: file.path
          });
        }
      }
    }

    let recipients = [];
    
    if (sendMode === "single") {
      if (!recipientEmail) {
        return res.status(400).json({ error: "Recipient email required" });
      }
      recipients = [{ email: recipientEmail, name: "" }];
    } else {
      // Parse CSV file for bulk sending
      if (!req.files.csvFile || req.files.csvFile.length === 0) {
        return res.status(400).json({ error: "CSV file required for bulk send" });
      }

      const csvFile = req.files.csvFile[0];
      
      recipients = await new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(csvFile.path)
          .pipe(csv())
          .on('data', (data) => {
            if (data.email) {
              results.push({
                email: data.email,
                name: data.name || ""
              });
            }
          })
          .on('end', () => resolve(results))
          .on('error', reject);
      });
    }

    // Send emails
    let successCount = 0;
    let failCount = 0;

    for (const recipient of recipients) {
      try {
        const mailOptions = {
          from: `${senderName} <${senderEmail}>`,
          to: recipient.email,
          subject: subject,
          html: body.replace(/\n/g, '<br>'),
          attachments: attachments
        };

        await transporter.sendMail(mailOptions);
        successCount++;
      } catch (error) {
        console.error(`Failed to send to ${recipient.email}:`, error);
        failCount++;
      }
    }

    // Clean up uploaded files
    if (req.files) {
      Object.values(req.files).flat().forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    res.json({
      success: true,
      message: `Successfully sent ${successCount} email(s)${failCount > 0 ? `, ${failCount} failed` : ''}`,
      successCount,
      failCount
    });

  } catch (error) {
    console.error("Email sending error:", error);
    
    // Clean up uploaded files on error
    if (req.files) {
      Object.values(req.files).flat().forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    
    res.status(500).json({ 
      error: "Failed to send email",
      details: error.message 
    });
  }
});

export default router;
