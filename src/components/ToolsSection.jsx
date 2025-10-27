import React, { useEffect, useState } from "react";
import { QrCode, MessageSquare, Mail, FileText, File, ArrowRight, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const ToolCard = ({ colorClass, icon: Icon, title, description, to, delay = 0 }) => {
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
      className={`group block ${colorClass} p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } relative overflow-hidden`}
    >
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className="flex items-center mb-6">
          <div className="relative group-hover:scale-110 transition-transform duration-300">
            <div className="absolute inset-0 bg-white/50 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-4 rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg">
              <Icon className="w-8 h-8 text-gray-800" />
            </div>
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-300">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-700 mb-6 group-hover:text-gray-600 transition-colors duration-300 leading-relaxed">
          {description}
        </p>
        
        {/* CTA */}
        <div className="flex items-center text-sm font-semibold text-gray-800 group-hover:text-gray-700 transition-colors duration-300">
          <span>Launch Tool</span>
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
      
      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
      colorClass: "bg-gradient-to-br from-pink-100 to-pink-200 border border-pink-200", 
      to: "/qr-code",
      delay: 0
    },
    { 
      title: "WhatsApp Message", 
      icon: MessageSquare, 
      description: "Send WhatsApp messages directly from your browser. Quick and easy communication without opening the app.", 
      colorClass: "bg-gradient-to-br from-green-100 to-green-200 border border-green-200", 
      to: "/whatsapp",
      delay: 200
    },
    { 
      title: "Email Generator", 
      icon: Mail, 
      description: "Compose professional emails with our smart templates. Perfect for business communication and outreach.", 
      colorClass: "bg-gradient-to-br from-purple-100 to-purple-200 border border-purple-200", 
      to: "/email",
      delay: 400
    },
    { 
      title: "PDF Editor", 
      icon: FileText, 
      description: "Edit your PDF files easily with our intuitive interface. Add text, images, and annotations seamlessly.", 
      colorClass: "bg-gradient-to-br from-blue-100 to-blue-200 border border-blue-200", 
      to: "/pdf-editor",
      delay: 600
    },
    { 
      title: "File Converter", 
      icon: File, 
      description: "Convert files between different formats instantly. Support for images, documents, and more.", 
      colorClass: "bg-gradient-to-br from-indigo-100 to-indigo-200 border border-indigo-200", 
      to: "/file-converter",
      delay: 800
    }
  ];

  return (
    <section id="tools" className="relative py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-10 blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-pink-400 to-blue-400 rounded-full opacity-10 blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 mb-6 shadow-lg border border-gray-200/50">
            <Zap className="w-4 h-4 text-yellow-500 mr-2" />
            <span>Choose Your Tool</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Powerful Tools for
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Every Need
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Simple, powerful utilities designed to save you time and effort. 
            <span className="font-semibold text-gray-800">No registration required</span> - just pick a tool and start working.
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
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Need Something Else?
            </h3>
            <p className="text-gray-600 mb-6">
              We're constantly adding new tools based on user feedback. Let us know what you'd like to see next!
            </p>
            <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
              <Mail className="w-5 h-5 mr-2" />
              Request a Tool
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
