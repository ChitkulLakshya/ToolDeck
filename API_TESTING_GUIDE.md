# API Testing Guide

## 🧪 How to Test the API Implementation

### 1. Install Dependencies

```bash
cd /home/premsaik/Desktop/Projects/ToolDeck
npm install axios
```

**If npm not available:** The `axios` dependency is already in `package.json`, so it will be installed when you run `npm install` later.

---

## 2. Start Backend Server

```bash
cd backend
npm install  # If not already done
npm start
```

**Expected output:**
```
============================================================
🚀 ToolDeck Backend Server Started
============================================================
📡 Port: 5000
🌍 Environment: development
🔗 Base URL: http://localhost:5000
💚 Health Check: http://localhost:5000/api/health
📧 Email API: http://localhost:5000/api/email
📚 API Docs: http://localhost:5000/api/docs
============================================================
```

---

## 3. Test Backend Endpoints

### Test Health Check
```bash
curl http://localhost:5000/api/health
```

**Expected response:**
```json
{
  "success": true,
  "message": "Server running ✅",
  "timestamp": "2025-10-28T...",
  "uptime": 123.456,
  "environment": "development",
  "mongodb": "Connected ✅",
  "memory": {
    "used": "45MB",
    "total": "67MB"
  }
}
```

### Test API Documentation
```bash
curl http://localhost:5000/api/docs
```

Or visit in browser: http://localhost:5000/api/docs

---

## 4. Start Frontend

```bash
cd /home/premsaik/Desktop/Projects/ToolDeck
npm start
```

Frontend will start on http://localhost:3000

---

## 5. Test Email Page

### Step 1: Navigate to Email Page
- Open http://localhost:3000
- Click "Email Generator" or navigate to `/email`

### Step 2: Test AI Email Generation
1. **Upload Event Image** (optional):
   - Click "Choose Image" button
   - Select an event banner (PNG, JPG, JPEG, WebP)
   - Maximum 5MB

2. **Enter Context**:
   ```
   Tech club orientation event for freshers.
   Casual and welcoming tone.
   Include registration link and date.
   ```

3. **Click "Generate Email with AI"**

**Expected behavior:**
- Status: "🤖 AI is analyzing your event..."
- After ~3-5 seconds: "✅ Email generated successfully!"
- Email preview appears on right side with subject and body

**Console logs (F12 → Console):**
```
[API Request] POST /api/email/generate
[API Response] /api/email/generate { subject: "...", body: "..." }
```

### Step 3: Test Email Sending

1. **Fill Sender Details:**
   - Sender Email: `your-email@gmail.com`
   - Sender Name: `Your Name`

2. **Choose Send Mode:**
   - **Single:** Enter recipient email
   - **Bulk:** Upload CSV file (see `backend/sample_recipients.csv`)

3. **Add Attachments** (optional):
   - Click "Choose Files"
   - Select up to 5 files (max 10MB total)

4. **Click "Send Email"**

**Expected behavior:**
- Status: "📧 Sending email..."
- After ~2-5 seconds: "✅ Email sent successfully to 1 recipient(s)"
- Form resets after 3 seconds

**Console logs:**
```
[API Request] POST /api/email/send
[API Response] /api/email/send { message: "...", successCount: 1 }
```

---

## 6. Test Error Handling

### Test Network Error
1. Stop backend server
2. Try to generate email
3. **Expected:** "❌ Error: Network error. Please check your internet connection."

### Test Missing Fields
1. Don't upload image or enter context
2. Click "Generate Email with AI"
3. **Expected:** Alert: "Please upload an event image or provide context"

### Test File Size Limit
1. Upload image > 5MB
2. **Expected:** Alert: "Image size should be less than 5MB"

---

## 7. Test with Browser DevTools

### Check Network Requests
1. Open DevTools (F12)
2. Go to **Network** tab
3. Generate email
4. Look for request to `http://localhost:5000/api/email/generate`
5. Check request/response details

### Check Console Logs
Development mode shows detailed logs:
```
[API Request] POST /api/email/generate
[API Response] /api/email/generate { subject: "Welcome to...", body: "..." }
```

### Check localStorage
API utility supports auth tokens:
```javascript
// In Console
localStorage.setItem('authToken', 'test-token-123');

// Now API requests include:
// Authorization: Bearer test-token-123
```

---

## 8. Test API Functions Directly

Open browser console (F12) on Email Page:

```javascript
// Import is already available via EmailPage
// Test generateEmail
generateEmail({ context: 'Test event' })
  .then(result => console.log('Success:', result))
  .catch(error => console.error('Error:', error));

// Test health check
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(console.log);
```

---

## 9. Test with Postman/Insomnia

### Generate Email
```
POST http://localhost:5000/api/email/generate
Content-Type: multipart/form-data

Body:
- eventImage: [file] (optional)
- context: "Tech event for students"
```

### Send Email (Single)
```
POST http://localhost:5000/api/email/send
Content-Type: multipart/form-data

Body:
- senderEmail: "test@example.com"
- senderName: "Test User"
- subject: "Welcome!"
- body: "<h1>Hello World</h1>"
- sendMode: "single"
- recipientEmail: "recipient@example.com"
```

### Send Email (Bulk)
```
POST http://localhost:5000/api/email/send
Content-Type: multipart/form-data

Body:
- senderEmail: "test@example.com"
- senderName: "Test User"
- subject: "Newsletter"
- body: "<h1>Monthly Update</h1>"
- sendMode: "bulk"
- csvFile: [file] (backend/sample_recipients.csv)
```

---

## 10. Test Error Scenarios

### Scenario 1: Invalid Email
```javascript
sendEmail({
  senderEmail: 'invalid-email',  // No @ symbol
  senderName: 'Test',
  subject: 'Test',
  body: 'Test',
  sendMode: 'single',
  recipientEmail: 'test@example.com'
})
.catch(error => {
  // Should show validation error
  console.error(handleAPIError(error));
});
```

### Scenario 2: Missing Required Fields
```javascript
sendEmail({
  // Missing senderEmail
  senderName: 'Test',
  subject: 'Test',
  body: 'Test',
  sendMode: 'single',
  recipientEmail: 'test@example.com'
})
.catch(error => {
  // Should show "Invalid request" error
  console.error(handleAPIError(error));
});
```

### Scenario 3: Server Timeout
```javascript
// Set very short timeout
import { apiClient } from '../api/api';
apiClient.defaults.timeout = 1; // 1ms

await generateEmail({ context: 'test' });
// Should timeout and show error
```

---

## 11. Test Retry Logic

```javascript
import { retryRequest } from '../api/errorHandler';

let attempts = 0;

const flakeyFunction = async () => {
  attempts++;
  if (attempts < 3) {
    throw new Error('Server error');
  }
  return { success: true };
};

// Will retry 3 times before succeeding
const result = await retryRequest(flakeyFunction, 3, 100);
console.log('Succeeded after', attempts, 'attempts');
```

---

## 12. Test File Upload Progress

```javascript
import { uploadFile } from '../api/api';

const file = document.querySelector('input[type="file"]').files[0];

await uploadFile(file, (progress) => {
  console.log(`Upload progress: ${progress}%`);
  // Update progress bar UI
});
```

---

## 13. Performance Testing

### Measure API Call Duration
```javascript
console.time('generateEmail');
await generateEmail({ context: 'Test event' });
console.timeEnd('generateEmail');
// Output: generateEmail: 2547ms
```

### Test Concurrent Requests
```javascript
const promises = [];
for (let i = 0; i < 5; i++) {
  promises.push(checkHealth());
}

const results = await Promise.all(promises);
console.log('All 5 health checks completed:', results);
```

---

## 14. Test Configuration Changes

### Change Backend URL
```javascript
// .env.local
REACT_APP_API_URL=https://api.tooldeck.com

// Restart frontend
npm start

// API calls now go to production URL
```

### Change Timeout
```javascript
// src/api/config.js
TIMEOUT: {
  EMAIL: 120000,  // 2 minutes
}

// Longer operations won't timeout as quickly
```

---

## 15. Automated Testing (Optional)

Create `src/api/api.test.js`:

```javascript
import { generateEmail, sendEmail, checkHealth } from './api';
import { handleAPIError } from './errorHandler';

describe('API Functions', () => {
  test('checkHealth returns server status', async () => {
    const result = await checkHealth();
    expect(result.success).toBe(true);
    expect(result.status).toHaveProperty('uptime');
  });

  test('handleAPIError formats network error', () => {
    const error = { message: 'Network Error' };
    const message = handleAPIError(error);
    expect(message).toContain('Network error');
  });

  test('handleAPIError formats 400 error', () => {
    const error = { response: { status: 400, data: { error: 'Invalid' } } };
    const message = handleAPIError(error);
    expect(message).toBe('Invalid');
  });
});
```

Run tests:
```bash
npm test
```

---

## ✅ Checklist

Before considering testing complete:

- [ ] Backend server starts without errors
- [ ] Frontend compiles without errors
- [ ] Health check endpoint returns 200
- [ ] Email generation works with context only
- [ ] Email generation works with image + context
- [ ] Single email sending works
- [ ] Bulk email sending works with CSV
- [ ] File attachments work (up to 5 files)
- [ ] Error messages are user-friendly
- [ ] Network errors are handled gracefully
- [ ] Loading states show during API calls
- [ ] Form resets after successful send
- [ ] Console logs appear in development
- [ ] No console errors or warnings
- [ ] Image preview shows uploaded banner
- [ ] Generated email is editable before sending
- [ ] Copy to clipboard works for subject/body

---

## 🐛 Common Issues

### Issue: "Module not found: Can't resolve 'axios'"
**Solution:** Run `npm install axios`

### Issue: "CORS policy: No 'Access-Control-Allow-Origin' header"
**Solution:** Backend CORS is configured. Ensure backend is running on port 5000.

### Issue: "Error: connect ECONNREFUSED 127.0.0.1:5000"
**Solution:** Backend server not running. Start with `cd backend && npm start`

### Issue: "Failed to generate email: Gemini API key not configured"
**Solution:** Check `backend/.env` has `GEMINI_API_KEY`. If missing, it uses mock responses.

### Issue: "Module parse failed: Unexpected token"
**Solution:** Restart frontend dev server with `npm start`

---

## 📊 Expected Results Summary

| Test | Expected Result | Time |
|------|----------------|------|
| Health Check | Server status with uptime | < 100ms |
| Email Generation (context only) | Subject + body | 2-5s |
| Email Generation (with image) | Subject + body | 3-7s |
| Single Email Send | Success message | 2-5s |
| Bulk Email Send (5 recipients) | Success count: 5 | 5-15s |
| Network Error | User-friendly message | Instant |
| File Upload | Progress 0-100% | Varies |

---

## 🎉 Success Criteria

API implementation is working correctly when:

1. ✅ No console errors
2. ✅ API calls succeed with valid data
3. ✅ Errors show user-friendly messages
4. ✅ Loading states work
5. ✅ Form validation prevents invalid submissions
6. ✅ Network logs show correct request/response
7. ✅ Backend logs show incoming requests
8. ✅ Email generation completes in < 10s
9. ✅ Email sending completes in < 30s (bulk)
10. ✅ UI remains responsive during API calls

---

**Happy Testing! 🚀**

If you encounter any issues, refer to:
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Complete API docs
- [API_QUICK_REFERENCE.md](./API_QUICK_REFERENCE.md) - Quick reference
- Backend logs: `backend/` terminal output
- Frontend console: Browser DevTools (F12)
