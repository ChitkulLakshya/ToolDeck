# 🚀 ToolDeck

<div align="center">
  
![ToolDeck Banner](https://img.shields.io/badge/ToolDeck-All--in--One%20Toolkit-blue?style=for-the-badge&logo=toolbox)

**Your Complete Productivity Suite - Simple, Powerful, and Free Forever**

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.18-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-5.1.0-000000?style=flat&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Ready-47A248?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/Demo-Live-success?style=flat&logo=vercel)](https://tool-deck.vercel.app)

[Features](#-features) • [Demo](#-live-demo) • [Quick Start](#-quick-start) • [Tech Stack](#-tech-stack) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Environment Setup](#-environment-setup)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Documentation](#-documentation)
- [License](#-license)

---

## 🌟 Overview

**ToolDeck** is a modern, all-in-one web toolkit built to make productivity effortless.  
It combines multiple powerful tools — **AI-powered Email Generator**, **Universal File Converter**, **WhatsApp Sender**, **QR Code Generator**, and **PDF Editor** — all in a sleek, responsive interface with full dark mode support.

ToolDeck is designed for **clubs, teams, and individuals** who want to streamline their digital workflows — from creating event emails to converting files or editing PDFs — all in one place, without downloads or installations.

### Why ToolDeck?

- ⚡ **Lightning Fast** — Powered by React 18 and Tailwind CSS  
- 🧠 **AI-Powered** — Smart content generation using Google Gemini 2.5 Flash
- 🔒 **Privacy First** — File conversions happen in your browser  
- 📱 **Fully Responsive** — Works perfectly on all devices  
- 🌙 **Dark Mode** — Beautiful theme with smooth transitions
- 🆓 **Completely Free** — No subscriptions, no hidden costs  
- 🚀 **Instant Access** — No downloads or installations required

---

## 🎯 Live Demo

**🌐 Production:** [https://tool-deck.vercel.app](https://tool-deck.vercel.app)

**📊 Backend API:** [https://tooldeck.onrender.com](https://tooldeck.onrender.com)

Try it now - no signup required!

---

## ✨ Features

ToolDeck provides **six powerful tools**, each crafted to solve everyday productivity problems:

---

### 1. 🎯 QR Code Generator
- Generate **QR codes** instantly from any text, link, or contact info  
- Customize colors, size, and error correction level  
- Download as **PNG, SVG**, or **copy directly**  
- Real-time preview and responsive design  

---

### 2. 💬 WhatsApp Message Sender
> Perfect for club/event use — send messages fast without saving contacts.

- Send **direct WhatsApp messages** to any number instantly  
- **No need to save contacts**  
- Add **delayed sending** (0–60 seconds) for batch sending  
- Supports **international formats** automatically  
- Great for **rush-hour communication** or event coordination  

---

### 3. ✉️ AI-Powered Email Generator
> Generate, personalize, and send professional emails with Google Gemini AI

- Upload an **event banner image** — AI analyzes it automatically  
- Provide brief **context** (e.g., "Tech fest invitation")  
- **AI generates complete email content**:  
  - Professional subject line  
  - Personalized greeting and body  
  - Strong call-to-action and closing  
- **Send emails directly** via SMTP (Nodemailer)  
- **Bulk email support** with CSV upload
- **User credential option** - send from your own email account
- Perfect for **college clubs**, **event organizers**, and **teams**  

**Powered by:** Google Gemini 2.5 Flash API

---

### 4. 📄 PDF Editor
> Professional PDF editing powered by Tldraw

- Built with **Tldraw v4.1.1** canvas and **PDF.js**  
- **Annotate, highlight, and draw** directly on PDFs  
- Add **text, shapes, and freehand drawings**  
- **Multi-page support** with smooth navigation
- **Export edited PDFs** or save as images
- **Zoom and pan** for precise editing
- **Clear canvas** option to start fresh

**Note:** Currently renders PDFs as images for annotation. Text extraction coming soon!  

---

### 5. 🔄 Universal File Converter
> Convert between any file format, seamlessly in your browser

- Supports **images, documents, spreadsheets, and PDFs**:  
  - **Images:** PNG ↔ JPG ↔ JPEG ↔ WebP ↔ BMP ↔ GIF
  - **PDF ↔ Images:** Convert PDFs to images or images to PDF  
  - **Documents:** DOCX ↔ TXT ↔ HTML ↔ PDF  
  - **Spreadsheets:** CSV ↔ JSON ↔ XLSX ↔ HTML
- **Drag & drop** file upload interface
- **Advanced quality settings** and compression control  
- **Real-time preview** before conversion
- **Progress indicator** for large files
- **Conversion history** tracking
- Runs **100% client-side** (no uploads, complete privacy)  

**Libraries:** pdf-lib, mammoth, xlsx, browser-image-compression

---

### 6. 🏠 Landing Page & Features
- **Interactive hero** with animated Aurora background (WebGL)
- **Floating particles** and smooth animations
- **Stats section** showing app capabilities
- **Tool showcase** with glass-morphism cards
- **Full dark mode** with smooth theme transitions
- **Responsive design** for all screen sizes
- **SEO optimized** with meta tags

---

## 🛠 Tech Stack

### Frontend Core
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2.0 | UI framework with hooks and context |
| **React Router DOM** | 6.30.1 | Client-side routing |
| **Tailwind CSS** | 3.4.18 | Utility-first CSS framework |
| **PostCSS** | 8.5.6 | CSS preprocessing |
| **Axios** | 1.13.0 | HTTP client for API calls |

### Specialized Libraries
| Library | Version | Purpose |
|---------|---------|---------|
| **Tldraw** | 4.1.1 | Canvas-based PDF annotation |
| **PDF.js** | 5.4.296 | PDF parsing and rendering |
| **pdf-lib** | 1.17.1 | PDF manipulation and export |
| **OGL** | 1.0.11 | WebGL animations (Aurora) |
| **qrcode.react** | 4.2.0 | QR code generation |
| **html2canvas** | 1.4.1 | Canvas to image conversion |
| **file-saver** | 2.0.5 | Client-side downloads |
| **mammoth** | 1.11.0 | DOCX to HTML parser |
| **XLSX** | 0.18.5 | Excel/CSV processing |
| **browser-image-compression** | 2.0.2 | Image optimization |
| **lucide-react** | 0.259.0 | Modern icon library |
| **react-scroll** | 1.9.3 | Smooth scrolling |

### Backend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| **Express.js** | 5.1.0 | Web server framework |
| **MongoDB** | Latest | NoSQL database |
| **Mongoose** | 8.19.1 | MongoDB ODM |
| **Nodemailer** | 6.9.15 | SMTP email delivery |
| **Google Generative AI** | 0.21.0 | Gemini API client |
| **Multer** | 1.4.5 | File upload middleware |
| **dotenv** | 17.2.3 | Environment config |
| **CORS** | 2.8.5 | Cross-origin requests |

---

## � Quick Start

### Prerequisites
- **Node.js** 16.x or higher
- **npm** or **yarn**
- **MongoDB** (local or Atlas) - optional for dev
- **Gemini API Key** (for AI email generation)

### Frontend Setup

```env
### Frontend Setup

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/tooldeck.git
cd tooldeck

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Configure .env
# REACT_APP_API_URL=http://localhost:5000

# 5. Start development server
npm start

# App runs on http://localhost:3000
```

### Backend Setup

```bash
# 1. Navigate to backend folder
cd backend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Configure backend .env
# PORT=5000
# MONGO_URI=your_mongodb_connection_string
# GEMINI_API_KEY=your_gemini_api_key
# EMAIL_USER=your_email@gmail.com
# EMAIL_PASS=your_app_specific_password

# 5. Start backend server
npm run dev

# Backend runs on http://localhost:5000
```

### Production Build

```bash
# Build frontend for production
npm run build

# Serve production build
npx serve -s build

# Or deploy to Vercel/Netlify
```

---

## 🔐 Environment Variables

### Frontend (.env)
```env
# API Configuration
REACT_APP_API_URL=https://tooldeck.onrender.com  # Production backend
# REACT_APP_API_URL=http://localhost:5000        # Development backend
```

### Backend (backend/.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database
MONGO_URI=mongodb://localhost:27017/tooldeck
# OR use MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/tooldeck

# Google Gemini AI (Required for email generation)
GEMINI_API_KEY=your_gemini_api_key_here
# Get your key from: https://makersuite.google.com/app/apikey

# Email Configuration (Gmail SMTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
# Generate app password: https://myaccount.google.com/apppasswords
```

---

## 📚 Documentation

- **[README.md](README.md)** - Project overview and setup guide
- **[CODEBASE_SUMMARY.md](CODEBASE_SUMMARY.md)** - Comprehensive code documentation
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Complete API reference
- **[DARK_MODE_IMPLEMENTATION.md](DARK_MODE_IMPLEMENTATION.md)** - Theme system guide
- **[DEPLOYMENT_FIX_GUIDE.md](DEPLOYMENT_FIX_GUIDE.md)** - Deployment troubleshooting

---

## 🌐 Deployment

### Live URLs
- **Frontend:** [https://tool-deck.vercel.app](https://tool-deck.vercel.app)
- **Backend:** [https://tooldeck.onrender.com](https://tooldeck.onrender.com)

### Quick Deploy Guides
See **[DEPLOYMENT_FIX_GUIDE.md](DEPLOYMENT_FIX_GUIDE.md)** for detailed instructions.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow existing code style
- Add comments for complex logic
- Test thoroughly before submitting
- Update documentation as needed

---

## 🐛 Known Issues & Roadmap

### Known Issues
- PDF text extraction not yet implemented (renders as images)
- File size limits on some conversions
- WhatsApp API limitations (opens web.whatsapp.com)

### Roadmap
- [ ] Add user authentication
- [ ] Implement file history/favorites
- [ ] Add more conversion formats
- [ ] Improve PDF text editing
- [ ] Add template library for emails
- [ ] Implement offline mode (PWA)
- [ ] Add keyboard shortcuts
- [ ] Implement batch operations

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Prem Saik**
- GitHub: [@prem22k](https://github.com/prem22k)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

---

## 🙏 Acknowledgments

- **Google Gemini** for AI-powered email generation
- **Tldraw** for the amazing canvas editor
- **Tailwind CSS** for the beautiful styling system
- **React** community for the excellent ecosystem
- All contributors and users of ToolDeck!

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/prem22k/ToolDeck?style=social)
![GitHub forks](https://img.shields.io/github/forks/prem22k/ToolDeck?style=social)
![GitHub issues](https://img.shields.io/github/issues/prem22k/ToolDeck)
![GitHub pull requests](https://img.shields.io/github/issues-pr/prem22k/ToolDeck)

---

<div align="center">

**Made with ❤️ by developers, for developers**

⭐ Star this repo if you find it useful! ⭐

[Report Bug](https://github.com/prem22k/ToolDeck/issues) • [Request Feature](https://github.com/prem22k/ToolDeck/issues) • [Documentation](CODEBASE_SUMMARY.md)

</div>
