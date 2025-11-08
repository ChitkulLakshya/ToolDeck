# ToolDeck - Codebase Summary

**Last Updated:** November 8, 2025

---

# Project Overview

ToolDeck is a modern, all-in-one productivity suite built with React 18 and Tailwind CSS that provides six powerful web-based tools: QR Code Generator, WhatsApp Message Sender, AI-Powered Email Generator, PDF Editor, and Universal File Converter. The app features a sleek, glass-morphism UI with smooth animations, full dark mode support, and responsive design. It's designed for clubs, teams, and individuals who need quick access to productivity tools without installations—everything runs in the browser with an optional Express.js backend for AI-powered email generation. The visual experience includes animated Aurora backgrounds, floating particles, smooth page transitions, and an elegant theme-aware interface.

---

# Repo Structure

```
ToolDeck/
├── backend/
│   ├── server.js                    # Express.js API server
│   ├── package.json                 # Backend dependencies
│   ├── routes/
│   │   └── emailRoutes.js           # Email generation & sending endpoints
│   ├── sample_recipients.csv        # Example CSV for bulk email
│   └── .env.example                 # Backend environment template
├── src/
│   ├── index.js                     # React app entry point
│   ├── App.jsx                      # Main app with routing & providers
│   ├── components/
│   │   ├── Aurora.jsx               # Animated gradient background
│   │   ├── HeroSection.jsx          # Landing page hero
│   │   ├── ToolsSection.jsx         # Tool cards display
│   │   ├── StatsSection.jsx         # Statistics showcase
│   │   ├── Header.jsx               # Navigation bar with theme toggle
│   │   ├── Footer.jsx               # Footer with links
│   │   ├── ThemeToggle.jsx          # Dark/Light mode switcher
│   │   ├── Toast.jsx                # Notification system
│   │   ├── LoadingSpinner.jsx       # Loading states
│   │   └── ErrorBoundary.jsx        # Error handling wrapper
│   ├── pages/
│   │   ├── HomePage.jsx             # Landing page
│   │   ├── QRCodePage.jsx           # QR code generator
│   │   ├── WhatsAppPage.jsx         # WhatsApp message sender
│   │   ├── EmailPage.jsx            # AI email generator
│   │   ├── PDFEditorPage.jsx        # PDF editor (Tldraw)
│   │   ├── FileConverterPage.jsx    # Universal file converter
│   │   └── NotFoundPage.jsx         # 404 page
│   ├── contexts/
│   │   ├── ThemeContext.jsx         # Dark mode state management
│   │   └── ToastContext.jsx         # Toast notification provider
│   ├── layouts/
│   │   ├── MainLayout.jsx           # Header + Footer wrapper
│   │   └── FullScreenLayout.jsx     # No header/footer (PDF editor)
│   ├── styles/
│   │   └── index.css                # Global CSS + theme variables
│   └── api/
│       └── api.js                   # Axios API configuration
├── public/
│   ├── index.html                   # HTML template
│   └── ...                          # Static assets
├── package.json                     # Frontend dependencies
├── tailwind.config.js               # Tailwind configuration
├── postcss.config.js                # PostCSS config
├── .env                             # Frontend environment variables
├── .env.example                     # Frontend env template
└── README.md                        # Project documentation
```

---

# How to Run

## Frontend (React)

### Development
```bash
# Install dependencies
npm install

# Start dev server (runs on port 3000)
npm start
```
**Dev Server:** `http://localhost:3000`

### Production Build
```bash
# Create optimized production build
npm run build

# Serve production build locally
npx serve -s build
```

### Test
```bash
npm test
```

## Backend (Express.js + MongoDB)

### Development
```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Start backend server (runs on port 5000)
npm run dev
```
**Backend Server:** `http://localhost:5000`
**Health Check:** `http://localhost:5000/api/health`

### Production
```bash
npm start
```

---

# Main Tech Stack & Dependencies

## Frontend Core
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2.0 | UI framework |
| **React Router DOM** | 6.30.1 | Client-side routing |
| **Tailwind CSS** | 3.4.18 | Utility-first CSS framework |
| **PostCSS** | 8.5.6 | CSS preprocessing |
| **Axios** | 1.13.0 | HTTP client for API calls |

## Specialized Libraries
| Library | Version | Purpose |
|---------|---------|---------|
| **Tldraw** | 4.1.1 | Canvas-based PDF editor |
| **PDF.js** | 5.4.296 | PDF rendering & parsing |
| **pdf-lib** | 1.17.1 | PDF manipulation |
| **qrcode.react** | 4.2.0 | QR code generation |
| **html2canvas** | 1.4.1 | Screenshot/canvas export |
| **file-saver** | 2.0.5 | Client-side file downloads |
| **mammoth** | 1.11.0 | DOCX to HTML conversion |
| **XLSX** | 0.18.5 | Spreadsheet parsing |
| **browser-image-compression** | 2.0.2 | Image compression |
| **lucide-react** | 0.259.0 | Icon library |
| **react-scroll** | 1.9.3 | Smooth scrolling |

## Backend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| **Express.js** | 5.1.0 | Web server framework |
| **MongoDB** | Latest | Database (via Mongoose) |
| **Mongoose** | 8.19.1 | MongoDB ODM |
| **Nodemailer** | 6.9.15 | SMTP email sending |
| **@google/generative-ai** | 0.21.0 | Gemini AI API client |
| **Multer** | 1.4.5 | File upload handling |
| **dotenv** | 17.2.3 | Environment configuration |

---

# Entry Points & Routing

## Main Entry File
**`src/index.js`**
- Creates React root
- Renders `<App />` component
- Imports global CSS (`src/styles/index.css`)

## App Component & Router
**`src/App.jsx`**
- Wraps app in providers: `ThemeProvider`, `ToastProvider`, `ErrorBoundary`
- Uses `React Router DOM` for routing
- Lazy loads all page components with `React.lazy()` and `Suspense`

### Routes Structure
```jsx
Routes with MainLayout (Header + Footer):
  /                    → HomePage
  /qr-code            → QRCodePage
  /whatsapp           → WhatsAppPage
  /email              → EmailPage
  /file-converter     → FileConverterPage

Routes with FullScreenLayout (No Header/Footer):
  /pdf-editor         → PDFEditorPage

Fallback:
  *                   → NotFoundPage (404)
```

---

# Visual / Motion Layers

## Aurora Background
**File:** `src/components/Aurora.jsx`
- **Purpose:** Animated gradient background using WebGL canvas
- **Library:** OGL (WebGL library)
- **Implementation:** Fragment shader with animated UV distortion
- **Props:** `colorStops`, `amplitude`, `blend`, `speed`
- **Usage:** Displayed behind hero section with 30% opacity
- **Performance:** Runs at 60fps, uses `requestAnimationFrame`

## Animations & Interactions
- **Framer Motion:** Not currently used (could be added)
- **CSS Transitions:** All theme changes use CSS `transition-colors` (200ms)
- **Custom Animations:** 
  - `fadeIn` keyframe in `index.css` for page load
  - `bounce` animation for floating icons (via Tailwind)
  - Smooth scroll via `react-scroll` library
- **Pointer Interactions:** 
  - Hover effects on cards (`hover:scale-105`, `hover:shadow-2xl`)
  - Button animations with icon translations
  - No cursor-following or particle repulsion (could be added)

## Canvas Usage
1. **Aurora.jsx** - WebGL canvas for animated background
2. **PDFEditorPage.jsx** - Tldraw canvas for PDF editing
3. **html2canvas** - Used in FileConverterPage for screenshot conversion

---

# Components Map

## Navigation & Layout

### Header.jsx
**Path:** `src/components/Header.jsx`
- **Purpose:** Top navigation bar with logo, nav links, and theme toggle
- **Props:** None (uses React Router hooks)
- **Styling:** Fixed header with backdrop-blur, border-bottom, smooth scroll offset
- **Features:** 
  - Active route highlighting
  - Mobile responsive hamburger menu
  - Integrated ThemeToggle component
  - Smooth scroll to sections on homepage

### Footer.jsx
**Path:** `src/components/Footer.jsx`
- **Purpose:** Site footer with links, social icons, and copyright
- **Props:** None
- **Styling:** Dark background with gradient border-top
- **Features:** Quick links, external links, responsive grid layout

### ThemeToggle.jsx
**Path:** `src/components/ThemeToggle.jsx`
- **Purpose:** Dark/Light mode switcher button
- **Props:** None (uses ThemeContext)
- **Styling:** Icon button with moon/sun icons, smooth transitions
- **Features:** Persists preference to localStorage, detects system preference

## Hero & Landing

### HeroSection.jsx
**Path:** `src/components/HeroSection.jsx`
- **Purpose:** Landing page hero with animated background and CTA
- **Props:** None
- **Styling:** Full-height section with Aurora background, gradient overlay, floating icons
- **Animations:** 
  - Fade-in on mount (opacity + translateY)
  - Bounce animations for decorative icons (Sparkles, Star)
  - Hover effects on feature pills and CTA button
- **Features:** 
  - Badge with user trust indicator
  - Gradient text headings
  - Feature pills (Lightning Fast, User Friendly, Save Time)
  - CTA button with smooth scroll to tools section
  - Stats grid (6+ tools, ∞ users, 100% free)

### ToolsSection.jsx
**Path:** `src/components/ToolsSection.jsx`
- **Purpose:** Displays grid of tool cards with icons and descriptions
- **Props:** None
- **Styling:** Responsive grid (1/2/3 columns), glass-morphism cards
- **Features:** 
  - Each card links to tool page
  - Hover animations (scale, shadow)
  - Icons from lucide-react
  - Dark mode compatible

### StatsSection.jsx
**Path:** `src/components/StatsSection.jsx`
- **Purpose:** Showcase app statistics and achievements
- **Props:** None
- **Styling:** Centered grid layout with number animations
- **Features:** Display metrics like tool count, user satisfaction, uptime

### Aurora.jsx
**Path:** `src/components/Aurora.jsx`
- **Purpose:** WebGL-powered animated gradient background
- **Props:** `colorStops` (array), `amplitude` (number), `blend` (number), `speed` (number)
- **Styling:** Full-screen canvas with position absolute
- **Implementation:** OGL library with custom fragment shader
- **Performance:** Optimized with RAF, automatic cleanup on unmount

## Utility Components

### LoadingSpinner.jsx
**Path:** `src/components/LoadingSpinner.jsx`
- **Purpose:** Loading indicator for Suspense fallback and async operations
- **Props:** Optional `message` string
- **Styling:** Centered spinner with optional text, theme-aware colors

### Toast.jsx
**Path:** `src/components/Toast.jsx`
- **Purpose:** Notification/toast message system
- **Props:** `message`, `type` (success/error/warning/info)
- **Styling:** Fixed position, animated slide-in, auto-dismiss after 3s
- **Features:** Used via ToastContext provider

### ErrorBoundary.jsx
**Path:** `src/components/ErrorBoundary.jsx`
- **Purpose:** Catches React errors and displays fallback UI
- **Props:** `children`
- **Styling:** Error message with reload button
- **Features:** Logs errors to console, prevents app crash

---

# State Management & Data Flow

## Global State

### ThemeContext
**File:** `src/contexts/ThemeContext.jsx`
- **Purpose:** Manages dark/light theme state across app
- **State:** `theme` ('light' | 'dark'), `mounted` (boolean)
- **Methods:** `toggleTheme()`, `setLightTheme()`, `setDarkTheme()`, `setSystemTheme()`
- **Persistence:** localStorage (`tooldeck-theme`)
- **Features:** 
  - Auto-detects system preference on first load
  - Listens for system theme changes
  - Updates `<html>` class and meta theme-color

### ToastContext
**File:** `src/contexts/ToastContext.jsx`
- **Purpose:** Global notification system
- **Methods:** `showToast(message, type)`, shortcuts: `success()`, `error()`, `warning()`, `info()`
- **State:** Toast queue with auto-dismiss timers

## Data Sources

### Static Data
- Tool information (icons, descriptions, routes) hardcoded in `ToolsSection.jsx`
- No external CMS or API for content

### Dynamic Data (Backend API)
- **Email Generation:** POST `/api/email/generate` - Gemini AI generates email content
- **Email Sending:** POST `/api/email/send` - Nodemailer sends emails (single/bulk)
- **Future:** Planned endpoints for user preferences and history

### Client-Side Processing
- **File Converter:** All conversions happen in browser (no backend)
- **QR Code:** Generated client-side with `qrcode.react`
- **PDF Editor:** Rendered and edited client-side with Tldraw + PDF.js

## API Configuration
**File:** `src/api/api.js`
- Axios instance with base URL from env: `REACT_APP_API_URL`
- Default timeout, error handling, interceptors
- Used by EmailPage to call backend

---

# Styling & Theming

## Tailwind CSS
**Config:** `tailwind.config.js`
- **Content:** Scans all `src/**/*.{js,jsx}` files
- **Dark Mode:** Class-based (`.dark` class on `<html>`)
- **Extended Colors:** Maps to CSS variables:
  - `background`, `card-background`
  - `primary-accent`, `secondary-accent`
  - `text-heading`, `text-body`, `text-muted`
  - `border`, `success`, `warning`, `error`, `info`
- **Custom Animations:** `fadeIn` keyframe

## CSS Variables (Design System)
**File:** `src/styles/index.css`

### Light Mode (:root)
```css
--color-background: #ffffff           /* White */
--color-card-background: #f9fafb      /* Off-white */
--color-primary-accent: #3B82F6       /* Electric Blue */
--color-secondary-accent: #2DD4BF     /* Teal */
--color-text-heading: #111827         /* Charcoal */
--color-text-body: #374151            /* Medium Gray */
--color-text-muted: #6B7280           /* Light Gray */
--color-border: #e5e7eb               /* Light Gray */
```

### Dark Mode (.dark)
```css
--color-background: #111827           /* Charcoal */
--color-card-background: #1F2937      /* Lighter Charcoal */
--color-text-heading: #F9FAFB         /* Near-white */
--color-text-body: #D1D5DB            /* Lighter Gray */
--color-text-muted: #9CA3AF           /* Medium Gray */
--color-border: #374151               /* Dark Gray */
```

### Theme Transitions
- All elements: `transition-colors duration-200` (applied globally in `@layer base`)
- Smooth color changes when toggling themes

## Custom Utilities
- `.animate-fadeIn` - Page load animation
- `.card-dark` - Styled card with background and border
- `.text-dark`, `.text-muted-dark` - Text color utilities
- Custom scrollbar with gradient thumb

---

# Performance / Accessibility Notes

## Performance Optimizations
✅ **Implemented:**
- **Lazy Loading:** All pages lazy loaded with `React.lazy()` and `Suspense`
- **Code Splitting:** Automatic with Create React App
- **Optimized Images:** Should use `browser-image-compression` for uploads
- **Client-Side Processing:** File conversions avoid server round-trips

⚠️ **Missing/Needs Improvement:**
- No lazy loading for images (no `loading="lazy"` attributes)
- Large project screenshots not optimized
- Aurora canvas runs continuously (could pause when off-screen)
- No service worker for offline support
- No image compression on upload in EmailPage

## Accessibility
✅ **Good:**
- Semantic HTML tags (`<header>`, `<footer>`, `<section>`, `<nav>`)
- Theme toggle accessible with keyboard
- Focus states on interactive elements
- Color contrast meets WCAG standards (verified with theme variables)

⚠️ **Needs Improvement:**
- Missing `alt` attributes on decorative icons
- No `aria-label` on icon-only buttons
- No keyboard navigation for mobile menu
- Missing `role` attributes on custom components
- No screen reader announcements for toast notifications
- Form validation messages not announced to screen readers

---

# Key Scripts / Build Configurations

## package.json Scripts (Frontend)
```json
{
  "start": "react-scripts start",      // Dev server (port 3000)
  "build": "react-scripts build",      // Production build
  "test": "react-scripts test",        // Jest tests
  "eject": "react-scripts eject"       // Eject from CRA (irreversible)
}
```

## package.json Scripts (Backend)
```json
{
  "start": "node server.js",           // Production server
  "dev": "nodemon server.js"           // Dev server with auto-reload
}
```

## Build Configuration
- **Build Tool:** Create React App (Webpack under the hood)
- **No custom webpack config** (would require ejecting)
- **PostCSS:** Configured for Tailwind in `postcss.config.js`
- **Environment Variables:**
  - Frontend: `REACT_APP_API_URL` (must start with `REACT_APP_`)
  - Backend: `PORT`, `MONGO_URI`, `GEMINI_API_KEY`, `EMAIL_USER`, `EMAIL_PASS`

---
