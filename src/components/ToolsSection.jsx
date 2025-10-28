import React, { useEffect, useState } from "react";
import { QrCode, MessageSquare, Mail, FileText, File, ArrowRight, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const ToolCard = ({ icon: Icon, title, description, to, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Link
      to={to}
      className={`group block bg-[#1F2937] p-8 rounded-3xl shadow-xl border border-[#374151] hover:border-[#3B82F6] hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } relative overflow-hidden`}
    >
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Sparkles className="w-5 h-5 text-[#3B82F6] animate-pulse" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className="flex items-center mb-6">
          <div className="relative group-hover:scale-110 transition-transform duration-300">
            <div className="absolute inset-0 bg-[#3B82F6]/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-4 rounded-2xl bg-[#111827] shadow-lg border border-[#374151]">
              <Icon className="w-8 h-8 text-[#3B82F6]" />
            </div>
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-2xl font-bold text-[#F9FAFB] mb-4 group-hover:text-white transition-colors duration-300">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-[#D1D5DB] mb-6 group-hover:text-[#E5E7EB] transition-colors duration-300 leading-relaxed">
          {description}
        </p>
        
        {/* CTA */}
        <div className="flex items-center text-sm font-semibold text-[#3B82F6] group-hover:text-[#2DD4BF] transition-colors duration-300">
          <span>Launch Tool</span>
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
      
      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#3B82F6]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </Link>
  );
};

export default function ToolsSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const tools = [
    { 
      title: "QR Code Generator", 
      icon: QrCode, 
      description: "Create beautiful, customizable QR codes instantly. Perfect for sharing links, contact info, or any text content.", 
      to: "/qr-code",
      delay: 0
    },
    { 
      title: "WhatsApp Message", 
      icon: MessageSquare, 
      description: "Send WhatsApp messages directly from your browser. Quick and easy communication without opening the app.", 
      to: "/whatsapp",
      delay: 200
    },
    { 
      title: "Email Generator", 
      icon: Mail, 
      description: "Compose professional emails with our smart templates. Perfect for business communication and outreach.", 
      to: "/email",
      delay: 400
    },
    { 
      title: "PDF Editor", 
      icon: FileText, 
      description: "Edit your PDF files easily with our intuitive interface. Add text, images, and annotations seamlessly.", 
      to: "/pdf-editor",
      delay: 600
    },
    { 
      title: "File Converter", 
      icon: File, 
      description: "Convert files between different formats instantly. Support for images, documents, and more.", 
      to: "/file-converter",
      delay: 800
    }
  ];

  return (
    <section id="tools" className="relative py-20 bg-[#111827] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#3B82F6] rounded-full opacity-5 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#2DD4BF] rounded-full opacity-5 blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-flex items-center px-4 py-2 bg-[#1F2937] backdrop-blur-sm rounded-full text-sm font-medium text-[#D1D5DB] mb-6 shadow-lg border border-[#374151]">
            <Zap className="w-4 h-4 text-[#3B82F6] mr-2" />
            <span>Choose Your Tool</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#F9FAFB] mb-6 leading-tight">
            Powerful Tools for
            <span className="block bg-gradient-to-r from-[#3B82F6] to-[#2DD4BF] bg-clip-text text-transparent">
              Every Need
            </span>
          </h2>
          
          <p className="text-xl text-[#D1D5DB] max-w-4xl mx-auto leading-relaxed">
            Simple, powerful utilities designed to save you time and effort. 
            <span className="font-semibold text-[#F9FAFB]">No registration required</span> - just pick a tool and start working.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool, idx) => (
            <ToolCard key={idx} {...tool} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-16 transition-all duration-700 delay-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="bg-[#1F2937] backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[#374151] max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-[#F9FAFB] mb-4">
              Need Something Else?
            </h3>
            <p className="text-[#D1D5DB] mb-6">
              We're constantly adding new tools based on user feedback. Let us know what you'd like to see next!
            </p>
            <button className="inline-flex items-center px-6 py-3 bg-[#3B82F6] text-white font-semibold rounded-xl hover:bg-[#2563EB] transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
              <Mail className="w-5 h-5 mr-2" />
              Request a Tool
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
