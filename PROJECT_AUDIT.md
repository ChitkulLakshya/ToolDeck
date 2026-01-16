# PROJECT_AUDIT.md

## The One-Liner
A high-performance productivity suite seamlessly combining AI-driven event communication with privacy-first, client-side document manipulation and creative whiteboard tools.

## The 'Technical Hook' (Crucial)
**Custom PDF-to-Canvas Rendering Pipeline**  
The project's standout technical achievement is the `PDFEditorPage`, which implements a custom bridge between `pdfjs-dist` and the `tldraw` infinite canvas. This system iteratively rasterizes PDF pages into HTML5 Canvas elements, normalizes them into high-resolution PNG assets, and injects them as manipulatable "shapes" directly onto the whiteboard. This architecture enables sophisticated, layer-based PDF annotation entirely within the browser's memory, bypassing the need for server-side processing.

**File Path:** [`src/pages/PDFEditorPage.jsx`](src/pages/PDFEditorPage.jsx) (Lines 38-118)

## The True Stack (Evidence-Based)
**Frontend Core:**
*   **React 18** & **Tailwind CSS**: Component architecture and styling.
*   **Tldraw**: Infinite canvas and whiteboard engine.
*   **Lucide React**: Vector iconography.

**Document Engineering:**
*   **pdfjs-dist**: Low-level PDF parsing and rendering.
*   **pdf-lib**: Client-side PDF modification and assembly.
*   **Mammoth**: DOCX to HTML conversion.
*   **XLSX / SheetJS**: Spreadsheet data manipulation.
*   **jsPDF & html2canvas**: Rasterization and export utilities.

**Backend Infrastructure:**
*   **Node.js & Express**: API runtime and routing.
*   **Mongoose**: MongoDB object modeling.
*   **Google Generative AI (Gemini)**: Content generation service.
*   **Nodemailer**: SMTP transport layer.
*   **Multer**: Multipart/form-data handling.

**Dependency Audit:**
*   `whatsapp-web.js` is installed but currently unutilized; the application leverages lightweight URL schemes (`wa.me`) for WhatsApp integration to reduce bundle size and complexity.

## Architecture & Scale Indicators
*   **Database**: **MongoDB**. The architecture employs a robust connection strategy via Mongoose with optimized pooling configurations (`serverSelectionTimeoutMS`, `socketTimeoutMS`), indicating a production-ready database layer despite current low schema complexity.
*   **Authentication**: **Open Access**. The system is designed as a frictionless, public-facing toolset with no mandatory user sessions or authentication barriers.
*   **Deployment**: **Vercel-Optimized**. The backend configuration explicitly handles proxy trust (`app.set('trust proxy', 1)`), ensuring accurate rate limiting and IP resolution in load-balanced serverless environments.

## Product Features
1.  **AI-Driven Event Communication**: An intelligent backend service utilizing Google's Gemini AI to analyze raw event context or imagery and autonomously generate professional, structured email invitations.
2.  **Browser-Native PDF Studio**: A zero-latency PDF editor permitting users to upload documents, perform freehand annotations via an infinite canvas, and export modified files without server interaction.
3.  **Universal File Converter**: A client-side transformation engine enabling instant conversion between diverse formats (CSV↔JSON, DOCX→HTML, PNG↔PDF) with drag-and-drop mechanics.
