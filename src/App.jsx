import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import StatsSection from "./components/StatsSection";
import ToolsSection from "./components/ToolsSection";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import QRCodePage from "./pages/QRCodePage";
import WhatsAppPage from "./pages/WhatsAppPage";
import EmailPage from "./pages/EmailPage";
import PDFEditorPage from "./pages/PDFEditorPage";
import FileConverterPage from "./pages/FileConverterPage";

const App = () => {
  return (
    <Router>
      <div className="font-sans antialiased text-gray-900 min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
             <Route path="/" element={<HomePage />} />
             <Route path="/tools" element={<ToolsSection />} />
             <Route path="/qr-code" element={<QRCodePage />} />
             <Route path="/email" element={<EmailPage />} />
             <Route path="/whatsapp" element={<WhatsAppPage />} />
             <Route path="/pdf-editor" element={<PDFEditorPage />} />
             <Route path="/file-converter" element={<FileConverterPage />} />
           </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
