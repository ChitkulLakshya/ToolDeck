# API Quick Reference

## 🚀 Quick Start

```javascript
// Import what you need
import { generateEmail, sendEmail, checkHealth } from '../api/api';
import { handleAPIError } from '../api/errorHandler';

// Generate AI email
const email = await generateEmail({
  eventImage: file,      // Optional
  context: 'Your event description'
});

// Send email
await sendEmail({
  senderEmail: 'you@example.com',
  senderName: 'Your Name',
  subject: email.subject,
  body: email.body,
  sendMode: 'single',
  recipientEmail: 'recipient@example.com'
});

// Check server health
const health = await checkHealth();
```

## 📚 All Functions

| Function | Purpose | Parameters |
|----------|---------|------------|
| `generateEmail(data)` | AI email generation | `{ eventImage?, context }` |
| `sendEmail(data)` | Send email | `{ senderEmail, senderName, subject, body, sendMode, recipientEmail?, csvFile?, attachments? }` |
| `convertFile(data)` | File conversion | `{ file, convertTo, options? }` |
| `getUserData(id)` | Fetch user data | `sessionId` |
| `saveUserData(data)` | Save user data | `{ sessionId, preferences, history }` |
| `deleteUserData(id)` | Delete user data | `sessionId` |
| `checkHealth()` | Server health | None |
| `uploadFile(file, cb)` | Upload with progress | `file, onProgress` |
| `downloadFile(url, name)` | Download file | `url, filename` |

## 🎯 Common Patterns

### With Error Handling
```javascript
try {
  const result = await generateEmail(data);
  setEmail(result);
} catch (error) {
  alert(handleAPIError(error));
}
```

### With Loading State
```javascript
const [loading, setLoading] = useState(false);

const handleAction = async () => {
  setLoading(true);
  try {
    await sendEmail(data);
  } finally {
    setLoading(false);
  }
};
```

### With Retry
```javascript
import { retryRequest } from '../api/errorHandler';

await retryRequest(() => sendEmail(data), 3, 1000);
```

### With Progress
```javascript
await uploadFile(file, (progress) => {
  setProgress(progress);
});
```

## 🔧 Configuration

```javascript
import { API_CONFIG } from '../api/config';

// Access config
API_CONFIG.BASE_URL           // 'http://localhost:5000'
API_CONFIG.TIMEOUT.EMAIL      // 60000 (60 seconds)
API_CONFIG.FILE_SIZE_LIMITS.IMAGE  // 5242880 (5MB)
```

## ⚙️ Environment Variables

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

## 🐛 Error Messages

| Status | Message |
|--------|---------|
| Network | "Network error. Please check your internet connection." |
| 400 | "Invalid request. Please check your input." |
| 401 | "Unauthorized. Please log in again." |
| 404 | "Resource not found." |
| 413 | "File too large. Please reduce file size." |
| 500 | "Server error. Please try again later." |

## 📡 Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/email/generate` | POST | Generate email |
| `/api/email/send` | POST | Send email |
| `/api/convert` | POST | Convert file |
| `/api/data/:id` | GET | Get user data |
| `/api/data` | POST | Save user data |
| `/api/data/:id` | DELETE | Delete data |

## 💡 Tips

1. **Always handle errors:** Use try-catch + handleAPIError()
2. **Validate inputs:** Check required fields before API calls
3. **Show loading states:** Better UX with loading indicators
4. **Use retry for critical ops:** sendEmail, uploadFile, etc.
5. **Log errors in production:** Use logError() for debugging

## 📖 Full Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete guide.
