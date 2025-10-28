import React from "react";
import { Heart, Github, Twitter, Mail, ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#111827] text-white overflow-hidden border-t border-[#374151]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-[#3B82F6] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">TD</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#2DD4BF] bg-clip-text text-transparent">
                ToolDeck
              </span>
            </div>
            <p className="text-[#D1D5DB] text-lg mb-6 max-w-md">
              Your all-in-one toolkit for productivity. Simple, powerful tools designed to make your life easier.
            </p>
            <div className="flex items-center space-x-2 text-[#D1D5DB]">
              <span>Made with</span>
              <Heart className="w-5 h-5 text-red-500 animate-pulse" />
              <span>by the ToolDeck Team</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#F9FAFB]">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-[#D1D5DB] hover:text-[#3B82F6] transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/qr-code" className="text-[#D1D5DB] hover:text-[#3B82F6] transition-colors duration-200">
                  QR Generator
                </Link>
              </li>
              <li>
                <Link to="/file-converter" className="text-[#D1D5DB] hover:text-[#3B82F6] transition-colors duration-200">
                  File Converter
                </Link>
              </li>
              <li>
                <Link to="/pdf-editor" className="text-[#D1D5DB] hover:text-[#3B82F6] transition-colors duration-200">
                  PDF Editor
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#F9FAFB]">Connect</h3>
            <div className="flex space-x-4 mb-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-[#1F2937] hover:bg-[#3B82F6] border border-[#374151] rounded-lg flex items-center justify-center transition-colors duration-200 group"
              >
                <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-[#1F2937] hover:bg-[#3B82F6] border border-[#374151] rounded-lg flex items-center justify-center transition-colors duration-200 group"
              >
                <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-[#1F2937] hover:bg-[#3B82F6] border border-[#374151] rounded-lg flex items-center justify-center transition-colors duration-200 group"
              >
                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
            </div>
            <p className="text-[#D1D5DB]/70 text-sm">
              Follow us for updates and new tools
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[#374151] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-[#D1D5DB]/70 text-sm mb-4 md:mb-0">
            &copy; 2025 ToolDeck. All rights reserved. Built with modern web technologies.
          </div>
          
          <button
            onClick={scrollToTop}
            className="flex items-center space-x-2 bg-[#3B82F6] hover:bg-[#2563EB] px-4 py-2 rounded-lg transition-all duration-200 group"
          >
            <span className="text-sm font-medium">Back to Top</span>
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
