# ToolDeck API Documentation

## Overview

The ToolDeck API provides a centralized utility layer for all frontend-backend communication. It uses **axios** for HTTP requests with comprehensive error handling, interceptors, and retry logic.

## Installation

```bash
# Install axios (already included in package.json)
npm install axios
```

## Project Structure

```
src/
├── api/
│   ├── api.js           # Main API functions
│   ├── config.js        # API configuration
│   ├── errorHandler.js  # Error handling utilities
│   └── index.js         # Centralized exports
```

---

## API Functions

### 📧 Email API

#### **`generateEmail(data)`**

Generate AI-powered email using Gemini Vision API.

**Parameters:**
```javascript
{
  eventImage: File,      // Event banner image (optional)
  context: string        // Event context/description
}
```

**Returns:**
```javascript
{
  success: true,
  subject: string,
  body: string
}
```

**Usage:**
```javascript
import { generateEmail } from '../api/api';

const result = await generateEmail({
  eventImage: file,
  context: 'Tech club orientation for freshers'
});

console.log(result.subject);
console.log(result.body);
```

**Throws:** Error with user-friendly message

---

#### **`sendEmail(data)`**

Send email in single or bulk mode with attachments.

**Parameters:**
```javascript
{
  senderEmail: string,        // Sender email address
  senderName: string,         // Sender name
  subject: string,            // Email subject
  body: string,               // Email body (HTML supported)
  sendMode: 'single'|'bulk',  // Send mode
  recipientEmail: string,     // For single mode
  csvFile: File,              // For bulk mode (email,name format)
  attachments: File[]         // Array of files (optional)
}
```

**Returns:**
```javascript
{
  success: true,
  message: string,
  successCount: number,
  failCount: number
}
```

**Usage:**
```javascript
import { sendEmail } from '../api/api';

// Single email
const result = await sendEmail({
  senderEmail: 'john@example.com',
  senderName: 'John Doe',
  subject: 'Welcome!',
  body: '<h1>Hello World</h1>',
  sendMode: 'single',
  recipientEmail: 'jane@example.com',
  attachments: [file1, file2]
});

// Bulk email
const result = await sendEmail({
  senderEmail: 'john@example.com',
  senderName: 'John Doe',
  subject: 'Newsletter',
  body: '<h1>Monthly Update</h1>',
  sendMode: 'bulk',
  csvFile: csvFile,
  attachments: []
});
```

**Throws:** Error with user-friendly message

---

### 🔄 File Conversion API

#### **`convertFile(data)`**

Convert files between formats (server-side for heavy operations).

**Parameters:**
```javascript
{
  file: File,           // File to convert
  convertTo: string,    // Target format (e.g., 'pdf', 'docx')
  options: Object       // Conversion options
}
```

**Returns:** `Blob` - Converted file

**Usage:**
```javascript
import { convertFile } from '../api/api';

const blob = await convertFile({
  file: myFile,
  convertTo: 'pdf',
  options: { quality: 'high', dpi: 300 }
});

// Download the converted file
const url = window.URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = 'converted.pdf';
link.click();
```

**Note:** Most conversions are handled client-side in `FileConverterPage.jsx`. This endpoint is for future server-side heavy operations.

---

### 💾 Data API

#### **`getUserData(sessionId)`**

Fetch user preferences and history.

**Parameters:**
- `sessionId` (string) - User session ID

**Returns:**
```javascript
{
  success: true,
  data: {
    preferences: Object,
    history: Array
  }
}
```

**Usage:**
```javascript
import { getUserData } from '../api/api';

const result = await getUserData('user-session-123');
console.log(result.data.preferences);
```

---

#### **`saveUserData(data)`**

Save user preferences and history.

**Parameters:**
```javascript
{
  sessionId: string,
  preferences: Object,
  history: Array
}
```

**Returns:**
```javascript
{
  success: true,
  data: Object
}
```

**Usage:**
```javascript
import { saveUserData } from '../api/api';

await saveUserData({
  sessionId: 'user-session-123',
  preferences: { theme: 'dark' },
  history: [{ action: 'converted PDF', timestamp: Date.now() }]
});
```

---

#### **`deleteUserData(sessionId)`**

Delete user data.

**Parameters:**
- `sessionId` (string) - User session ID

**Returns:**
```javascript
{
  success: true,
  message: string
}
```

---

### 🏥 Health Check API

#### **`checkHealth()`**

Check server health and status.

**Returns:**
```javascript
{
  success: true,
  status: {
    message: string,
    uptime: number,
    mongodb: string,
    memory: Object
  }
}
```

**Usage:**
```javascript
import { checkHealth } from '../api/api';

const health = await checkHealth();
console.log('Server uptime:', health.status.uptime);
```

---

### 📤 Utility Functions

#### **`uploadFile(file, onProgress)`**

Upload file with progress tracking.

**Parameters:**
- `file` (File) - File to upload
- `onProgress` (Function) - Progress callback (0-100)

**Returns:**
```javascript
{
  success: true,
  fileUrl: string,
  fileName: string
}
```

**Usage:**
```javascript
import { uploadFile } from '../api/api';

const result = await uploadFile(myFile, (progress) => {
  console.log(`Upload progress: ${progress}%`);
});

console.log('File URL:', result.fileUrl);
```

---

#### **`downloadFile(url, filename)`**

Download file from URL.

**Parameters:**
- `url` (string) - File URL
- `filename` (string) - Download filename

**Usage:**
```javascript
import { downloadFile } from '../api/api';

await downloadFile('http://localhost:5000/uploads/file.pdf', 'document.pdf');
```

---

## Configuration

### API_CONFIG

Centralized configuration for all API settings.

```javascript
import { API_CONFIG } from '../api/config';

console.log(API_CONFIG.BASE_URL);
console.log(API_CONFIG.TIMEOUT.EMAIL);
console.log(API_CONFIG.FILE_SIZE_LIMITS.IMAGE);
```

**Available Config:**
```javascript
{
  BASE_URL: 'http://localhost:5000',
  TIMEOUT: {
    DEFAULT: 30000,
    EMAIL: 60000,
    UPLOAD: 120000,
    CONVERSION: 120000
  },
  FILE_SIZE_LIMITS: {
    IMAGE: 5242880,        // 5MB
    ATTACHMENT: 10485760,  // 10MB
    CONVERSION: 20971520   // 20MB
  },
  SUPPORTED_FORMATS: {
    IMAGE: ['image/png', 'image/jpeg', ...],
    DOCUMENT: ['application/pdf', ...],
    SPREADSHEET: ['text/csv', ...]
  }
}
```

---

## Error Handling

### **`handleAPIError(error)`**

Convert API errors to user-friendly messages.

**Usage:**
```javascript
import { handleAPIError } from '../api/errorHandler';

try {
  await generateEmail({ context: 'test' });
} catch (error) {
  const friendlyMessage = handleAPIError(error);
  alert(friendlyMessage); // "Network error. Please check your internet connection."
}
```

**Error Messages:**
- 400: "Invalid request. Please check your input."
- 401: "Unauthorized. Please log in again."
- 403: "Access forbidden. You don't have permission."
- 404: "Resource not found."
- 413: "File too large. Please reduce file size."
- 500: "Server error. Please try again later."
- Network: "Network error. Please check your internet connection."

---

### **`retryRequest(fn, attempts, delay)`**

Retry failed requests with exponential backoff.

**Usage:**
```javascript
import { retryRequest } from '../api/errorHandler';

const result = await retryRequest(
  () => generateEmail({ context: 'test' }),
  3,    // 3 attempts
  1000  // 1 second initial delay
);
```

---

### **`logError(error, context)`**

Log errors in development or send to monitoring service in production.

**Usage:**
```javascript
import { logError } from '../api/errorHandler';

try {
  await sendEmail(data);
} catch (error) {
  logError(error, { userId: '123', action: 'sendEmail' });
  throw error;
}
```

---

## Axios Interceptors

### Request Interceptor

Automatically adds:
- Authorization tokens from `localStorage`
- Request logging in development
- Content-Type headers

### Response Interceptor

Automatically handles:
- Response logging in development
- 401 (Unauthorized) - Clear auth token
- 403 (Forbidden) - Log access denial
- 404 (Not Found) - Log missing resource
- 500 (Server Error) - Log server issues
- Network errors - Log connection issues

---

## Environment Variables

Create `.env` file in project root:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000

# Environment
REACT_APP_ENV=development

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_ENABLE_DEBUG=true
```

**Production:**
```env
REACT_APP_API_URL=https://api.tooldeck.com
REACT_APP_ENV=production
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_DEBUG=false
```

---

## Usage Examples

### Complete Email Generation Flow

```javascript
import React, { useState } from 'react';
import { generateEmail, sendEmail } from '../api/api';
import { handleAPIError } from '../api/errorHandler';

function EmailComponent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState({ subject: '', body: '' });

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await generateEmail({
        context: 'Tech event for students'
      });
      
      setEmail({ subject: result.subject, body: result.body });
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    try {
      const result = await sendEmail({
        senderEmail: 'me@example.com',
        senderName: 'John Doe',
        subject: email.subject,
        body: email.body,
        sendMode: 'single',
        recipientEmail: 'user@example.com',
        attachments: []
      });
      
      alert(result.message);
    } catch (err) {
      setError(handleAPIError(err));
    }
  };

  return (
    <div>
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Email'}
      </button>
      
      {email.subject && (
        <div>
          <h3>{email.subject}</h3>
          <div dangerouslySetInnerHTML={{ __html: email.body }} />
          <button onClick={handleSend}>Send Email</button>
        </div>
      )}
      
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

### Health Check on App Load

```javascript
import React, { useEffect, useState } from 'react';
import { checkHealth } from '../api/api';

function App() {
  const [serverStatus, setServerStatus] = useState('checking');

  useEffect(() => {
    const checkServer = async () => {
      try {
        await checkHealth();
        setServerStatus('online');
      } catch {
        setServerStatus('offline');
      }
    };
    
    checkServer();
  }, []);

  if (serverStatus === 'offline') {
    return <div>Server is offline. Please try again later.</div>;
  }

  return <YourApp />;
}
```

---

## Testing

### Test API Functions

```javascript
import { generateEmail, sendEmail, checkHealth } from './api/api';

// Test health check
checkHealth().then(console.log).catch(console.error);

// Test email generation
generateEmail({ context: 'Test event' })
  .then(console.log)
  .catch(console.error);

// Test email sending
sendEmail({
  senderEmail: 'test@example.com',
  senderName: 'Test User',
  subject: 'Test',
  body: 'Hello',
  sendMode: 'single',
  recipientEmail: 'recipient@example.com',
  attachments: []
}).then(console.log).catch(console.error);
```

---

## Best Practices

### 1. Always Handle Errors

```javascript
try {
  const result = await generateEmail(data);
} catch (error) {
  const message = handleAPIError(error);
  // Show to user
  alert(message);
  // Log for debugging
  logError(error, { action: 'generateEmail' });
}
```

### 2. Use Loading States

```javascript
const [loading, setLoading] = useState(false);

const handleAction = async () => {
  setLoading(true);
  try {
    await someAPICall();
  } finally {
    setLoading(false);
  }
};
```

### 3. Validate Input Before API Calls

```javascript
if (!email || !subject) {
  alert('Please fill all required fields');
  return;
}

await sendEmail(data);
```

### 4. Use Retry for Critical Operations

```javascript
import { retryRequest } from '../api/errorHandler';

const result = await retryRequest(
  () => sendEmail(data),
  3,
  1000
);
```

### 5. Clean Up Resources

```javascript
useEffect(() => {
  let cancelled = false;
  
  const fetchData = async () => {
    try {
      const result = await getUserData(sessionId);
      if (!cancelled) {
        setData(result.data);
      }
    } catch (error) {
      if (!cancelled) {
        setError(handleAPIError(error));
      }
    }
  };
  
  fetchData();
  
  return () => {
    cancelled = true;
  };
}, [sessionId]);
```

---

## Troubleshooting

### CORS Errors

**Problem:** "Access to fetch at 'http://localhost:5000' from origin 'http://localhost:3000' has been blocked by CORS policy"

**Solution:** Backend already configured with CORS. Ensure backend is running:
```bash
cd backend
npm start
```

### Network Errors

**Problem:** "Network error. Please check your internet connection."

**Solution:**
1. Check backend server is running (`http://localhost:5000/api/health`)
2. Verify `REACT_APP_API_URL` in `.env`
3. Check firewall settings

### 401 Unauthorized

**Problem:** "Unauthorized. Please log in again."

**Solution:** Token expired or invalid. Clear localStorage:
```javascript
localStorage.removeItem('authToken');
```

### File Too Large

**Problem:** "File too large. Please reduce file size."

**Solution:** Check file size limits in `API_CONFIG`:
- Images: 5MB
- Attachments: 10MB total
- Conversions: 20MB

---

## API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |
| GET | `/` | API info |
| GET | `/api/docs` | API documentation |
| POST | `/api/email/generate` | Generate AI email |
| POST | `/api/email/send` | Send email |
| POST | `/api/convert` | Convert file (coming soon) |
| GET | `/api/data/:sessionId` | Get user data (coming soon) |
| POST | `/api/data` | Save user data (coming soon) |
| DELETE | `/api/data/:sessionId` | Delete user data (coming soon) |

---

## Contributing

When adding new API functions:

1. Add function to `src/api/api.js`
2. Export from `src/api/index.js`
3. Add JSDoc comments
4. Add error handling
5. Update this documentation
6. Add usage examples

---

## Support

For issues or questions:
- Check `/api/docs` endpoint for live API documentation
- Review error messages in browser console
- Check backend logs
- Test health endpoint: `http://localhost:5000/api/health`

---

**Last Updated:** October 28, 2025  
**Version:** 1.0.0
