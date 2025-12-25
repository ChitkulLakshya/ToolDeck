import express from "express";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import nodemailer from "nodemailer";
import fs from "fs";
import csv from "csv-parser";
import path from "path";
import { Readable } from "stream";
import { aiGenerationLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Configure multer for memory storage (serverless friendly)
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Email generation endpoint - Rate Limited
router.post("/generate", aiGenerationLimiter, upload.single("eventImage"), async (req, res) => {
  try {
    const { context } = req.body;
    const imageBuffer = req.file?.buffer;

    if (!context && !imageBuffer) {
      return res.status(400).json({ error: "Please provide context or image" });
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY not configured, using mock response");
      
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
    // Using gemini-2.5-flash - Latest model with thinking capability
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
      systemInstruction: `You are an expert professional email writer specializing in event invitations and organizational communications. Your task is to create engaging, well-structured emails that are:
- Clear and concise
- Professional yet friendly
- Action-oriented with clear CTAs
- Properly formatted with sections
- Free of jargon unless specified
Always return ONLY valid JSON in the exact format: {"subject": "...", "body": "..."}`
    });

    let prompt = `Generate a professional email for the following event:

Context: ${context}

Requirements:
1. Subject line: Engaging and concise (max 60 characters)
2. Email body should include:
   - Warm greeting
   - Clear event description
   - Key details (use placeholders like [DATE], [TIME], [VENUE], [LINK] if not provided)
   - Strong call-to-action
   - Professional sign-off
3. Match the tone to the context (formal for corporate, casual for student events, etc.)
4. Keep the email concise but informative (150-300 words)

Return ONLY JSON: {"subject": "your subject here", "body": "your email body here"}`;

    let result;
    
    if (imageBuffer) {
      // Convert buffer to base64
      const base64Image = imageBuffer.toString('base64');
      
      result = await model.generateContent([
        {
          inlineData: {
            mimeType: req.file.mimetype,
            data: base64Image
          }
        },
        prompt
      ]);
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
    res.status(500).json({ 
      error: "Failed to generate email",
      details: error.message 
    });
  }
});

router.post('/send', upload.fields([
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
      senderPassword, // User's email password (if using own account)
      useOwnAccount, // Flag to indicate if user wants to use their own account
      subject, 
      body, 
      sendMode,
      recipientEmail 
    } = req.body;

    // Validate inputs
    if (!senderEmail || !senderName || !subject || !body) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Determine which credentials to use
    let emailUser, emailPass;
    
    if (useOwnAccount === 'true' || useOwnAccount === true) {
      // User wants to send from their own account
      if (!senderPassword) {
        return res.status(400).json({ error: "Email password required when using your own account" });
      }
      emailUser = senderEmail;
      emailPass = senderPassword;
      console.log(`Using user's own email account: ${senderEmail}`);
    } else {
      // Use server's configured email
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn("Email credentials not configured");
        
        // Return mock success
        return res.json({
          success: true,
          message: `Mock: Email would be sent to ${sendMode === 'single' ? recipientEmail : 'multiple recipients'}`,
          successCount: sendMode === 'single' ? 1 : 10,
          failCount: 0
        });
      }
      emailUser = process.env.EMAIL_USER;
      emailPass = process.env.EMAIL_PASS;
      console.log(`Using server's email account: ${emailUser}`);
    }

    // Prepare attachments
    const attachments = [];
    if (req.files) {
      for (let i = 0; i < 5; i++) {
        const attachmentKey = `attachment${i}`;
        if (req.files[attachmentKey]) {
          const file = req.files[attachmentKey][0];
          attachments.push({
            filename: file.originalname,
            content: file.buffer
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
        Readable.from(csvFile.buffer)
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

    // Configure Transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });

    let successCount = 0;
    let failCount = 0;

    for (const recipient of recipients) {
      try {
        // Personalize body
        let personalizedBody = body;
        if (recipient.name) {
          personalizedBody = personalizedBody.replace('[Name]', recipient.name);
        }

        const mailOptions = {
          from: `"${senderName}" <${emailUser}>`,
          to: recipient.email,
          subject: subject,
          text: personalizedBody,
          attachments: attachments
        };

        await transporter.sendMail(mailOptions);
        successCount++;
      } catch (error) {
        // Sanitize error log
        const sanitizedError = { ...error };
        if (sanitizedError.config?.auth) sanitizedError.config.auth.pass = '[REDACTED]';
        console.error(`Failed to send to ${recipient.email}:`, sanitizedError.message || "Unknown error");
        failCount++;
      }
    }

    res.json({
      success: true,
      message: `Successfully sent ${successCount} email(s)${failCount > 0 ? `, ${failCount} failed` : ''}`,
      successCount,
      failCount
    });

  } catch (error) {
    console.error("Email sending error:", error);
    
    res.status(500).json({ 
      error: "Failed to send email",
      details: error.message 
    });
  }
});
export default router;
