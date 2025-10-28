import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";
import MainLayout from "./layouts/MainLayout";
import FullScreenLayout from "./layouts/FullScreenLayout";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastProvider } from "./contexts/ToastContext";

// Lazy load pages for better performance
const HomePage = lazy(() => import("./pages/HomePage"));
const QRCodePage = lazy(() => import("./pages/QRCodePage"));
const WhatsAppPage = lazy(() => import("./pages/WhatsAppPage"));
const EmailPage = lazy(() => import("./pages/EmailPage"));
const PDFEditorPage = lazy(() => import("./pages/PDFEditorPage"));
const FileConverterPage = lazy(() => import("./pages/FileConverterPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <Router>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Routes with Header + Footer */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/qr-code" element={<QRCodePage />} />
                  <Route path="/whatsapp" element={<WhatsAppPage />} />
                  <Route path="/email" element={<EmailPage />} />
                  <Route path="/file-converter" element={<FileConverterPage />} />
                </Route>

                {/* Full-screen routes (no Header/Footer) */}
                <Route element={<FullScreenLayout />}>
                  <Route path="/pdf-editor" element={<PDFEditorPage />} />
                </Route>

                {/* 404 Not Found */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </Router>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
