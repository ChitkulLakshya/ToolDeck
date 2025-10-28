# 🚀 ToolDeck

<div align="center">
  
![ToolDeck Banner](https://img.shields.io/badge/ToolDeck-All--in--One%20Toolkit-blue?style=for-the-badge&logo=toolbox)

**Your Complete Productivity Suite - Simple, Powerful, and Free Forever**

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.18-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-5.1.0-000000?style=flat&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Ready-47A248?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Tech Stack](#-tech-stack) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**ToolDeck** is a modern, all-in-one productivity suite that brings together essential utilities in a beautiful, intuitive interface. Built with cutting-edge web technologies, ToolDeck offers a seamless experience for everyday tasks without any downloads or installations.

### Why ToolDeck?

- ⚡ **Lightning Fast** - Optimized performance with React 18
- 🎨 **Beautiful UI** - Modern design with Tailwind CSS and smooth animations
- 🔒 **Privacy First** - All processing happens in your browser
- 📱 **Fully Responsive** - Works perfectly on desktop, tablet, and mobile
- 🆓 **100% Free** - No subscriptions, no hidden costs
- 🚀 **No Installation** - Browser-based tools ready to use instantly

---

## ✨ Features

ToolDeck provides **6 powerful tools** designed to simplify your daily workflows:

### 1. 🎯 QR Code Generator
- **Instant QR generation** from URLs, text, contact info, or any content
- **Customizable styling** - adjust colors, size, and error correction levels
- **Multiple export formats** - download as PNG, SVG, or copy to clipboard
- Real-time preview with customization options
- Error correction levels: Low (7%), Medium (15%), Quartile (25%), High (30%)

### 2. 💬 WhatsApp Message Sender
- **Direct messaging** without saving contacts to your phone
- **Delayed sending** - schedule messages with custom delays (0-60 seconds)
- **International support** - automatic country code formatting
- Rich text support with emojis and line breaks
- Preview before sending

### 3. ✉️ Email Generator
- **Professional email templates** for business communication
- **CSV bulk import** - send to multiple recipients at once
- **Attachment support** - add PDFs and other files
- Email preview and validation
- Structured formatting for outreach campaigns

### 4. 📄 PDF Editor
- **Interactive PDF viewer** powered by Tldraw and PDF.js
- **Multi-page support** - view and edit PDFs with multiple pages
- **Annotation tools** - add drawings, shapes, and notes
- **Canvas-based editing** - Canva-style interface for intuitive editing
- **Export functionality** - save your edited PDFs
- High-quality rendering with customizable zoom levels

### 5. 🔄 File Converter
- **Universal format conversion** for images, documents, and spreadsheets
- **Image formats**: PNG, JPG, WebP, PDF
- **Document formats**: PDF, DOCX, TXT, HTML
- **Spreadsheet formats**: CSV, JSON, TXT
- **Text conversions**: CSV ↔ JSON, TXT ↔ HTML
- Quality and compression controls
- Real-time preview of converted files
- Drag-and-drop file upload

### 6. 🏠 Landing Page
- **Modern hero section** with animated gradients and floating particles
- **Statistics dashboard** showcasing tool metrics
- **Interactive tool cards** with smooth animations
- **Responsive navigation** with mobile menu
- SEO-optimized structure

---

## 🛠 Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2.0 | UI framework |
| **React Router DOM** | 6.30.1 | Client-side routing |
| **Tailwind CSS** | 3.4.18 | Utility-first styling |
| **Tldraw** | 4.1.1 | Canvas-based PDF editing |
| **PDF.js** | 5.4.296 | PDF rendering engine |
| **pdf-lib** | 1.17.1 | PDF manipulation |
| **Lucide React** | 0.259.0 | Modern icon library |
| **QRCode.react** | 4.2.0 | QR code generation |
| **html2canvas** | 1.4.1 | HTML to image conversion |
| **jsPDF** | 3.0.3 | PDF generation |
| **Mammoth** | 1.11.0 | DOCX processing |
| **file-saver** | 2.0.5 | Client-side downloads |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Express.js** | 5.1.0 | REST API server |
| **MongoDB** | Latest | NoSQL database |
| **Mongoose** | 8.19.1 | MongoDB ORM |
| **CORS** | 2.8.5 | Cross-origin resource sharing |
| **dotenv** | 17.2.3 | Environment management |

### Build Tools

- **react-scripts** 5.0.1 - Webpack bundler and dev server
- **PostCSS** 8.5.6 - CSS transformations
- **Autoprefixer** 10.4.21 - CSS vendor prefixing
- **ESLint** - Code quality and linting

---

## 🏗 Architecture

ToolDeck follows a **monolithic SPA architecture** with a separate Express.js backend:

```mermaid
graph TB
    subgraph "Frontend (React SPA)"
        A[React Router] --> B[Pages Layer]
        B --> C[Components Layer]
        C --> D[Tailwind CSS Styling]
        
        B --> E[HomePage]
        B --> F[QRCodePage]
        B --> G[WhatsAppPage]
        B --> H[EmailPage]
        B --> I[PDFEditorPage]
        B --> J[FileConverterPage]
        
        C --> K[Header]
        C --> L[Footer]
        C --> M[HeroSection]
        C --> N[StatsSection]
        C --> O[ToolsSection]
    end
    
    subgraph "Backend (Express + MongoDB)"
        P[Express Server] --> Q[CORS Middleware]
        P --> R[MongoDB Connection]
        P --> S[REST API Endpoints]
        S --> T[/api/data]
    end
    
    subgraph "External Services"
        U[PDF.js CDN]
        V[Tldraw Canvas]
        W[Browser APIs]
    end
    
    E -.-> W
    F -.-> W
    G -.-> W
    H -.-> P
    I -.-> U
    I -.-> V
    J -.-> W
    
    style A fill:#61DAFB
    style P fill:#68A063
    style R fill:#47A248
    style U fill:#FF6B6B
    style V fill:#9B6BFF
```

### Design Patterns

1. **Component-Based Architecture** - Reusable React components for maintainability
2. **Route-Based Code Splitting** - Each tool is a separate page for optimal loading
3. **State Management** - React hooks (useState, useEffect, useRef) for local state
4. **Client-Side Processing** - All file conversions happen in the browser for privacy
5. **RESTful API Design** - Backend follows REST principles
6. **Environment Configuration** - Separate .env files for different environments

---

## 📦 Installation

### Prerequisites

- **Node.js** 16.x or higher
- **npm** 8.x or higher (or **yarn** 1.22+)
- **MongoDB** 6.x or higher (for backend)

### Clone the Repository

```bash
git clone https://github.com/yourusername/ToolDeck.git
cd ToolDeck
```

### Frontend Setup

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will run on **http://localhost:3000**

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Start the backend server
npm start
```

The backend will run on **http://localhost:5000**

### Build for Production

```bash
# Create optimized production build
npm run build

# The build folder will contain the optimized static files
```

---

## 🔐 Environment Setup

Create a `.env` file in the **root directory** with the following variables:

```env
# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/tooldeck
# Or use MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/tooldeck

# Server Configuration
PORT=5000
NODE_ENV=development

# Optional: Email Service (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key_here

# Optional: WhatsApp API
WHATSAPP_API_KEY=your_whatsapp_api_key_here
```

### Environment Variables Explained

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | Yes |
| `PORT` | Backend server port | No (default: 5000) |
| `NODE_ENV` | Environment (development/production) | No |
| `SENDGRID_API_KEY` | SendGrid API for email features | Optional |
| `WHATSAPP_API_KEY` | WhatsApp Business API key | Optional |

### Security Best Practices

⚠️ **IMPORTANT**: Never commit `.env` files to version control!

```bash
# .gitignore already includes:
.env
.env.local
.env.production
```

---

## 🎯 Usage

### Running Locally

1. **Start MongoDB** (if using local instance):
   ```bash
   mongod
   ```

2. **Start Backend Server**:
   ```bash
   cd backend
   npm start
   ```

3. **Start Frontend Development Server**:
   ```bash
   npm start
   ```

4. Open your browser to **http://localhost:3000**

### Tool-Specific Usage

#### QR Code Generator
1. Navigate to `/qr-code`
2. Enter your URL or text content
3. Customize colors, size, and error correction level
4. Download as PNG/SVG or copy to clipboard

#### WhatsApp Sender
1. Navigate to `/whatsapp`
2. Enter phone number with country code (+1234567890)
3. Type your message
4. Optionally set a delay
5. Click "Send Message" to open WhatsApp Web

#### Email Generator
1. Navigate to `/email`
2. Fill in sender email and subject
3. Write your message body
4. Upload CSV for bulk sending (optional)
5. Add attachments (optional)
6. Preview and send

#### PDF Editor
1. Navigate to `/pdf-editor`
2. Click "Upload PDF" and select your file
3. Use drawing tools to annotate
4. Click "Save PDF" to download the edited version

#### File Converter
1. Navigate to `/file-converter`
2. Drag and drop or click to upload file
3. Select target format
4. Adjust quality settings (optional)
5. Click "Convert File" and download

---

## 📁 Project Structure

```
ToolDeck/
├── public/                    # Static assets
│   └── index.html            # HTML template
│
├── src/                      # Frontend source code
│   ├── components/           # Reusable React components
│   │   ├── Header.jsx       # Navigation header with mobile menu
│   │   ├── Footer.jsx       # Footer with links and social icons
│   │   ├── HeroSection.jsx  # Landing page hero with animations
│   │   ├── StatsSection.jsx # Statistics display with counters
│   │   └── ToolsSection.jsx # Tool cards grid with hover effects
│   │
│   ├── pages/               # Route-based page components
│   │   ├── HomePage.jsx     # Main landing page
│   │   ├── QRCodePage.jsx   # QR code generator tool
│   │   ├── WhatsAppPage.jsx # WhatsApp message sender
│   │   ├── EmailPage.jsx    # Email generator
│   │   ├── PDFEditorPage.jsx # PDF viewer and editor
│   │   └── FileConverterPage.jsx # Universal file converter
│   │
│   ├── styles/              # Global styles
│   │   └── index.css        # Tailwind directives and custom CSS
│   │
│   ├── App.jsx              # Main app component with routing
│   ├── index.js             # React app entry point
│   └── eslint.config.js     # ESLint configuration
│
├── backend/                  # Backend server
│   ├── server.js            # Express server with MongoDB
│   └── package.json         # Backend dependencies
│
├── .gitignore               # Git ignore rules
├── package.json             # Frontend dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
└── README.md                # This file
```

### Key Files Explained

- **src/App.jsx** - Configures React Router with all page routes
- **src/pages/PDFEditorPage.jsx** - Tldraw-based PDF editor with canvas rendering
- **src/pages/FileConverterPage.jsx** - Multi-format file conversion logic
- **backend/server.js** - Express server with MongoDB connection and CORS
- **tailwind.config.js** - Custom Tailwind theme and content paths
- **package.json** - All frontend dependencies and npm scripts

---

## 🌐 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Endpoints

#### Health Check

```http
GET /
```

**Response:**
```json
{
  "message": "Server is running ✅"
}
```

#### Submit Data

```http
POST /api/data
```

**Request Body:**
```json
{
  "key": "value",
  "data": "example"
}
```

**Response:**
```json
{
  "message": "Received data!",
  "data": {
    "key": "value",
    "data": "example"
  }
}
```

### Future API Endpoints (Planned)

- `POST /api/email/send` - Send emails via SendGrid
- `POST /api/qr/generate` - Server-side QR generation
- `POST /api/pdf/convert` - Server-side PDF processing
- `GET /api/analytics` - Usage statistics

---

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

#### Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

#### Netlify

```bash
# Build the project
npm run build

# Deploy build folder
netlify deploy --prod --dir=build
```

### Backend Deployment (Render/Heroku)

#### Render

1. Create new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables from `.env`

#### Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create tooldeck-backend

# Set environment variables
heroku config:set MONGO_URI=your_mongo_uri

# Deploy
git subtree push --prefix backend heroku main
```

### Environment Variables for Production

Ensure these are set in your hosting platform:

- `MONGO_URI` - Production MongoDB Atlas connection string
- `NODE_ENV=production`
- `PORT` (auto-assigned by most hosts)
- API keys for any external services

### MongoDB Atlas Setup

1. Create free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Whitelist your deployment IP (or use 0.0.0.0/0 for testing)
3. Create database user
4. Copy connection string to `MONGO_URI`

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Contribution Guidelines

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/ToolDeck.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow existing code style
   - Add comments for complex logic
   - Ensure responsive design

4. **Test your changes**
   ```bash
   npm start
   npm run build
   ```

5. **Commit with descriptive messages**
   ```bash
   git commit -m "feat: add dark mode toggle"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Open a Pull Request**
   - Describe your changes
   - Reference any related issues
   - Include screenshots for UI changes

### Code Style

- Use functional React components with hooks
- Follow Airbnb JavaScript style guide
- Use meaningful variable and function names
- Keep components small and focused
- Add PropTypes or TypeScript types

### What to Contribute

- 🐛 **Bug fixes** - Fix issues or edge cases
- ✨ **New features** - Add new tools or functionality
- 📝 **Documentation** - Improve README or add JSDoc comments
- 🎨 **UI/UX** - Enhance design or animations
- ⚡ **Performance** - Optimize bundle size or rendering
- 🧪 **Tests** - Add unit or integration tests

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 ToolDeck Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- **React Team** - For the amazing framework
- **Tailwind Labs** - For the utility-first CSS framework
- **Tldraw** - For the powerful canvas editing library
- **Mozilla PDF.js** - For PDF rendering capabilities
- **Lucide** - For beautiful icons
- All open-source contributors whose libraries made this project possible

---

## 📞 Contact & Support

- **Email**: support@tooldeck.com
- **GitHub Issues**: [Report a bug](https://github.com/yourusername/ToolDeck/issues)
- **Twitter**: [@tooldeck](https://twitter.com/tooldeck)
- **Discord**: [Join our community](https://discord.gg/tooldeck)

---

## 📊 Project Status

![GitHub issues](https://img.shields.io/github/issues/yourusername/ToolDeck)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/ToolDeck)
![GitHub last commit](https://img.shields.io/github/last-commit/yourusername/ToolDeck)
![GitHub stars](https://img.shields.io/github/stars/yourusername/ToolDeck?style=social)

### Roadmap

- [x] QR Code Generator
- [x] WhatsApp Message Sender
- [x] Email Generator
- [x] PDF Editor (Canvas-based)
- [x] File Converter
- [ ] Dark Mode Toggle
- [ ] User Authentication
- [ ] Cloud Storage Integration
- [ ] Text Extraction from PDFs
- [ ] Advanced Image Editing
- [ ] Batch File Processing
- [ ] API Rate Limiting
- [ ] Analytics Dashboard
- [ ] PWA Support

---

<div align="center">
  
**Made with ❤️ by the ToolDeck Team**

[⬆ Back to Top](#-tooldeck)

</div>
