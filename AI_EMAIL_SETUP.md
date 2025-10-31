# AI Email Generator Setup Guide

## ✅ Files Created/Updated:

### Frontend:
- ✅ `/src/pages/EmailPage.jsx` - Complete AI-powered email generator UI

### Backend:
- ✅ `/backend/routes/emailRoutes.js` - Email generation and sending routes
- ✅ `/backend/server.js` - Updated with email routes
- ✅ `/backend/package.json` - Added required dependencies
- ✅ `/backend/.env.example` - Environment variables template

## 📦 Installation Steps:

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

This will install:
- `@google/generative-ai` - For AI email generation
- `csv-parser` - For parsing CSV files (bulk send)
- `multer` - For file uploads
- `nodemailer` - For sending emails

### 2. Configure Environment Variables

Create `/backend/.env` file with your credentials:

```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/tooldeck

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Gemini AI API Key
# Get from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Gmail Configuration
# Enable 2FA and create App Password: https://myaccount.google.com/apppasswords
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_16_digit_app_password
```

### 3. Get Gemini API Key (FREE)

1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy and paste into `.env` file

### 4. Setup Gmail for Sending (Optional)

**For Gmail:**
1. Enable 2-Factor Authentication on your Google account
2. Go to: https://myaccount.google.com/apppasswords
3. Create an App Password for "Mail"
4. Copy the 16-digit password (no spaces)
5. Add to `.env` file

**Alternative:** Use any SMTP service (SendGrid, Mailgun, etc.)

### 5. Start the Servers

**Backend:**
```bash
cd backend
npm start
# Or with auto-reload:
npm run dev
```

**Frontend (separate terminal):**
```bash
npm start
```

## 🎯 Features Implemented:

### ✨ AI Generation:
- Upload event banner image (AI analyzes with Gemini Vision)
- Provide text context about your event
- AI generates professional subject + body
- Edit generated content before sending

### 📧 Email Sending:
- **Single Send:** Send to one recipient
- **Bulk Send:** Upload CSV file with email,name format
- Attach multiple files (PDFs, images, etc.)
- Real-time status updates

### 🔒 Fallback Mode:
- Works WITHOUT API keys (mock responses)
- Useful for testing UI/UX
- Replace with real keys for production

## 📝 CSV Format for Bulk Send:

Create a CSV file like this:
```csv
email,name
john@example.com,John Doe
jane@example.com,Jane Smith
bob@example.com,Bob Johnson
```

## 🧪 Testing Without API Keys:

The backend includes fallback/mock responses:
- **No GEMINI_API_KEY:** Returns template email based on context
- **No EMAIL credentials:** Simulates successful send without actually sending

This lets you test the complete flow immediately!

## 🚀 Production Checklist:

- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Add real `GEMINI_API_KEY`
- [ ] Configure `EMAIL_USER` and `EMAIL_PASSWORD`
- [ ] Test with real email addresses
- [ ] Set up MongoDB properly
- [ ] Configure CORS for your domain
- [ ] Add rate limiting for API endpoints
- [ ] Set up file upload size limits
- [ ] Add email validation
- [ ] Implement queue system for bulk emails

## 📚 API Endpoints:

### POST `/api/email/generate`
Generate email using AI

**Form Data:**
- `eventImage` (file, optional) - Event banner image
- `context` (string) - Event description

**Response:**
```json
{
  "success": true,
  "subject": "Generated subject line",
  "body": "Generated email body..."
}
```

### POST `/api/email/send`
Send email(s)

**Form Data:**
- `senderEmail` (string) - Your email
- `senderName` (string) - Your name
- `subject` (string) - Email subject
- `body` (string) - Email body
- `sendMode` (string) - "single" or "bulk"
- `recipientEmail` (string) - For single send
- `csvFile` (file) - For bulk send
- `attachment0`, `attachment1`, etc. (files, optional)

**Response:**
```json
{
  "success": true,
  "message": "Successfully sent X email(s)",
  "successCount": 5,
  "failCount": 0
}
```

## ❗ Common Issues:

**1. "npm: command not found"**
- Install Node.js from: https://nodejs.org/

**2. "Failed to generate email"**
- Check if GEMINI_API_KEY is set correctly
- Verify internet connection
- Check API key quota

**3. "Failed to send email"**
- Verify EMAIL_USER and EMAIL_PASSWORD
- Check if App Password is correct (no spaces)
- Gmail: Make sure 2FA is enabled
- Check SMTP settings for other providers

**4. MongoDB connection error**
- Install MongoDB locally OR
- Use MongoDB Atlas (free cloud database)
- Update MONGO_URI in .env

## 🎉 You're All Set!

Navigate to `http://localhost:3000/email` and start generating AI-powered emails!
