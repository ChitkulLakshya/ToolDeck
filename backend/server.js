import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';
import fs from "fs";
import emailRoutes from "./routes/emailRoutes.js";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Trust proxy is required for rate limiting to work correctly behind load balancers (e.g. Vercel, Heroku)
app.set('trust proxy', 1);

// ============================================
// MIDDLEWARE CONFIGURATION
// ============================================

// CORS Configuration
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "http://localhost:3000",
    "https://tool-deck.vercel.app",  // Production frontend
    "http://localhost:3000",          // Local development
    "http://localhost:5173"           // Vite dev server
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parser Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request Logging Middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Static Files (for uploaded files if needed)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================
// DIRECTORY SETUP
// ============================================

// Create necessary directories
const directories = ['uploads', 'temp', 'logs'];
directories.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dir}/`);
  }
});

// ============================================
// DATABASE CONNECTION
// ============================================

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/tooldeck";
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log("✅ MongoDB Connected Successfully");
    console.log(`📊 Database: ${mongoose.connection.name}`);
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    
    // Don't exit process in development - allow testing without DB
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      console.warn("⚠️  Running without database (development mode)");
    }
  }
};

// Handle MongoDB connection events
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
});

// Connect to database
connectDB();

// ============================================
// API ROUTES
// ============================================

// Health Check Route
app.get('/api/health', (req, res) => {
  const healthCheck = {
    success: true,
    message: "Server running ✅",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    mongodb: mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Disconnected ❌',
    memory: {
      used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
      total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`
    }
  };
  
  res.status(200).json(healthCheck);
});

// Root Route
app.get("/", (req, res) => {
  res.json({ 
    message: "ToolDeck Backend API",
    status: "running",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      email: "/api/email",
      convert: "/api/convert",
      data: "/api/data"
    },
    documentation: "/api/docs"
  });
});

// API Documentation Route
app.get("/api/docs", (req, res) => {
  res.json({
    title: "ToolDeck API Documentation",
    version: "1.0.0",
    baseURL: `http://localhost:${process.env.PORT || 5000}`,
    endpoints: [
      {
        method: "GET",
        path: "/api/health",
        description: "Health check endpoint",
        authentication: false
      },
      {
        method: "POST",
        path: "/api/email/generate",
        description: "Generate AI-powered email",
        authentication: false,
        body: {
          eventImage: "file (optional)",
          context: "string"
        }
      },
      {
        method: "POST",
        path: "/api/email/send",
        description: "Send email (single or bulk)",
        authentication: false,
        body: {
          senderEmail: "string",
          senderName: "string",
          subject: "string",
          body: "string",
          sendMode: "single|bulk",
          recipientEmail: "string (for single)",
          csvFile: "file (for bulk)"
        }
      },
      {
        method: "POST",
        path: "/api/convert",
        description: "Convert files between formats",
        authentication: false,
        status: "Coming Soon"
      },
      {
        method: "GET",
        path: "/api/data",
        description: "Fetch application data",
        authentication: false,
        status: "Coming Soon"
      }
    ]
  });
});

// Mount Routes
app.use("/api/email", emailRoutes);

// Placeholder routes for future features
app.use("/api/convert", (req, res) => {
  res.status(501).json({
    success: false,
    message: "File conversion endpoint coming soon!",
    note: "Most conversions are handled client-side in FileConverterPage.jsx"
  });
});

app.use("/api/data", (req, res) => {
  res.status(501).json({
    success: false,
    message: "Data API endpoint coming soon!",
    note: "This will be used for storing user preferences and history"
  });
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 Handler - Route Not Found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: "Validation Error",
      details: err.message
    });
  }
  
  if (err.name === 'MongoError' || err.name === 'MongooseError') {
    return res.status(503).json({
      success: false,
      error: "Database Error",
      details: process.env.NODE_ENV === 'development' ? err.message : 'Database operation failed'
    });
  }
  
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      error: "File too large",
      details: "Maximum file size is 10MB"
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    timestamp: new Date().toISOString()
  });
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

const gracefulShutdown = async (signal) => {
  console.log(`\n📦 Received ${signal}. Starting graceful shutdown...`);
  
  try {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log("✅ MongoDB connection closed");
    
    // Clean up temp files
    const tempDir = path.join(__dirname, 'temp');
    if (fs.existsSync(tempDir)) {
      const files = fs.readdirSync(tempDir);
      files.forEach(file => {
        fs.unlinkSync(path.join(tempDir, file));
      });
      console.log("✅ Temporary files cleaned");
    }
    
    console.log("✅ Graceful shutdown completed");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error during shutdown:", err);
    process.exit(1);
  }
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  gracefulShutdown('uncaughtException');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log("\n" + "=".repeat(60));
  console.log(`🚀 ToolDeck Backend Server Started`);
  console.log("=".repeat(60));
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Base URL: http://localhost:${PORT}`);
  console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📧 Email API: http://localhost:${PORT}/api/email`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api/docs`);
  console.log("=".repeat(60) + "\n");
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', err);
    process.exit(1);
  }
});

// Export app for testing
export default app;
