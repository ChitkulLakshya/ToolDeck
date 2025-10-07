import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import StatsSection from "./components/StatsSection";
import ToolsSection from "./components/ToolsSection";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import QRCodePage from "./pages/QRCodePage";
import EmailPage from "./pages/EmailPage";

const App = () => {
  return (
    <Router>
      <div className="font-sans antialiased text-gray-900 min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<><HeroSection /><StatsSection /><ToolsSection /></>} />
            <Route path="/qr-code" element={<QRCodePage />} />
            <Route path="/email" element={<EmailPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
