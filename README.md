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

**ToolDeck** is a modern, all-in-one web toolkit built to make productivity effortless.  
It combines multiple powerful tools like **AI-powered Email Generator**, **File Converter**, **WhatsApp Sender**, and more — all in a sleek, responsive interface.

ToolDeck is designed for **clubs, teams, and individuals** who want to streamline their digital workflows — from creating event emails to sending quick WhatsApp messages or editing PDFs — all in one place.

### Why ToolDeck?

- ⚡ **Fast & Lightweight** — Powered by React 18 and Tailwind CSS  
- 🧠 **AI-Powered** — Smart content generation for emails  
- 🔒 **Private** — File conversions and processing happen in your browser  
- 📱 **Fully Responsive** — Works perfectly on all devices  
- 🆓 **Completely Free** — No subscriptions, no hidden costs  
- 🚀 **Plug & Play** — Runs instantly in your browser  

---

## ✨ Features

ToolDeck provides **six major tools**, each crafted to solve everyday productivity problems.

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
> Generate, personalize, and send professional emails for events and clubs.

- Upload a **banner image** of an event — the AI analyzes it  
- Provide short **context or purpose** (e.g., “Orientation event invite”)  
- AI automatically **generates complete email content**:  
  - Subject line  
  - Greeting and structured body  
  - Closing and call-to-action  
- **Send emails directly** via built-in SMTP integration  
- **Automate follow-up emails** and bulk-send to CSV lists  
- Perfect for **college clubs**, **organizations**, and **event teams**  

---

### 4. 📄 PDF Editor
- Built using **Tldraw** and **PDF.js**  
- Annotate, highlight, and draw directly on PDFs  
- Add **text, shapes, or drawings** easily  
- Export or download edited files  
- Supports **multi-page PDFs** with zoom and navigation  

---

### 5. 🔄 Universal File Converter
> Convert **any file format to any other format**, seamlessly.

- Supports **image, document, and PDF** conversions:  
  - **Images:** PNG ↔ JPG ↔ JPEG ↔ WebP ↔ HEIC ↔ BMP  
  - **PDF ↔ Image:** Convert PDFs to PNG/JPG or merge images to PDF  
  - **Documents:** DOCX ↔ TXT ↔ HTML ↔ PDF  
  - **Spreadsheets:** CSV ↔ JSON ↔ XLSX  
- **Drag & drop** file upload  
- **Quality settings** and compression control  
- **Real-time preview** before download  
- Runs entirely **client-side** (no uploads or privacy risk)  

---

### 6. 🏠 Landing Page
- Interactive hero with **animated gradients** and **floating particles**  
- Displays tool stats and quick links  
- Responsive, SEO-optimized, and mobile-ready  

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2.0 | UI framework |
| **React Router DOM** | 6.30.1 | Routing |
| **Tailwind CSS** | 3.4.18 | Styling |
| **Tldraw** | 4.1.1 | PDF canvas editing |
| **PDF.js** | 5.4.296 | PDF rendering |
| **Lucide React** | 0.259.0 | Icons |
| **file-saver** | 2.0.5 | File download |
| **html2canvas** | 1.4.1 | Screenshot export |
| **Mammoth** | 1.11.0 | DOCX parsing |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Express.js** | 5.1.0 | API server |
| **MongoDB** | Latest | Database |
| **Mongoose** | 8.19.1 | ORM |
| **dotenv** | 17.2.3 | Environment config |
| **SendGrid API** | Latest | Email sending |

---

## 🏗 Architecture

ToolDeck follows a **monolithic SPA architecture** with:
- **React** frontend  
- **Express.js** backend  
- **MongoDB** database  

It’s built for **scalability** and **modularity**, allowing easy addition of new tools in the future.

---

## 🔐 Environment Setup

Create a `.env` file in your root directory:

```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/tooldeck

# Server
PORT=5000
NODE_ENV=development

# Email API
SENDGRID_API_KEY=your_sendgrid_api_key_here

# WhatsApp API
WHATSAPP_API_KEY=your_whatsapp_api_key_here
