
import React from "react";
import { Link } from "react-router-dom";
import { QrCode, MessageSquare, Mail, FileText, File, ArrowRight } from "lucide-react";
import heroAurora from "../assets/hero-aurora.png";

const HomePage = () => {
  const tools = [
    {
      title: "AI Email Generator",
      icon: Mail,
      description: "Draft professional communications in seconds.",
      to: "/email",
      featured: true,
      color: "text-primary-accent"
    },
    {
      title: "PDF Editor",
      icon: FileText,
      description: "Annotate and manipulate PDFs locally.",
      to: "/pdf-editor",
      featured: false
    },
    {
      title: "WhatsApp Direct",
      icon: MessageSquare,
      description: "Message without saving contacts.",
      to: "/whatsapp",
      featured: false
    },
    {
      title: "QR Code Generator",
      icon: QrCode,
      description: "Instant customizable matricies.",
      to: "/qr-code",
      featured: false
    },
    {
      title: "File Converter",
      icon: File,
      description: "Universal format transformation.",
      to: "/file-converter",
      featured: false
    }
  ];

  return (
    <div className="min-h-screen bg-background text-text-heading selection:bg-primary-accent selection:text-white overflow-x-hidden relative">
      {/* Global Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05] z-50 bg-noise mix-blend-overlay bg-repeat"></div>

      {/* Hero Aurora Background */}
      <div className="absolute top-0 left-0 right-0 h-[80vh] pointer-events-none overflow-hidden z-0">
        <img
          src={heroAurora}
          alt="Atmospheric light leak"
          className="w-full h-full object-cover opacity-60 mix-blend-screen filter blur-[80px] transform scale-110"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-24 relative z-10">

        {/* Editorial Hero Section */}
        <header className="mb-24 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-8">
            <div className="inline-block px-3 py-1 mb-6 border border-white/10 rounded-full backdrop-blur-sm">
              <span className="font-mono text-xs tracking-widest text-text-muted uppercase">V2.0 // Atmospheric</span>
            </div>

            <h1 className="font-mono text-6xl md:text-8xl font-bold tracking-tighter leading-none mb-6 -ml-1">
              TOOL<span className="text-white/50">DECK</span>
            </h1>

            <p className="font-sans text-xl text-text-body font-light max-w-xl leading-relaxed border-l border-primary-accent pl-6 ml-1">
              A curated suite of productivity engines designed for speed, privacy, and touch.
            </p>
          </div>

          <div className="md:col-span-4 flex justify-start md:justify-end pb-2">
            <button className="group relative px-8 py-4 bg-white text-black font-mono font-bold hover:bg-white/90 transition-all duration-300 overflow-hidden">
              <span className="relative z-10">START CREATING</span>
              <div className="absolute inset-0 bg-noise opacity-20 mix-blend-multiply"></div>
            </button>
          </div>
        </header>

        {/* 12-Column Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-12 mb-2 border-b border-white/10 pb-4 flex justify-between items-end">
            <h2 className="font-mono text-sm tracking-widest text-text-muted uppercase">Available Modules</h2>
            <span className="hidden md:block font-mono text-xs text-text-muted/50 rotate-90 origin-bottom-right translate-x-4">EST. 2026</span>
          </div>

          {/* Featured Card (Email) - Spans 4 cols */}
          <Link to="/email" className="md:col-span-12 lg:col-span-4 lg:row-span-2 group relative p-8 bg-zinc-900 border border-white/10 hover:border-primary-accent/50 transition-colors duration-500 flex flex-col justify-between min-h-[320px]">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-zinc-800 rounded-sm text-primary-accent">
                <Mail className="w-6 h-6" />
              </div>
              <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-primary-accent transition-colors" />
            </div>

            <div>
              <h3 className="font-mono text-xl font-bold text-white mb-2">AI Email Generator</h3>
              <p className="font-sans text-zinc-400 text-sm leading-relaxed">Draft professional communications in seconds using Gemini 1.5 Pro context analysis.</p>
            </div>

            {/* Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          </Link>

          {/* PDF Editor - Spans 4 cols */}
          <Link to="/pdf-editor" className="md:col-span-6 lg:col-span-4 group relative p-8 bg-zinc-900 border border-white/10 hover:border-primary-accent/50 transition-colors duration-500 flex flex-col justify-between min-h-[240px]">
            <div className="flex justify-between items-start mb-8">
              <div className="p-3 bg-zinc-800 rounded-sm text-zinc-400 group-hover:text-white transition-colors">
                <FileText className="w-6 h-6" />
              </div>
              <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-primary-accent transition-colors" />
            </div>
            <div>
              <h3 className="font-mono text-lg font-bold text-zinc-200 group-hover:text-white mb-1">PDF Editor</h3>
              <p className="font-sans text-zinc-400 text-xs">Annotate and manipulate PDFs locally.</p>
            </div>
          </Link>

          {/* WhatsApp - Spans 4 cols */}
          <Link to="/whatsapp" className="md:col-span-6 lg:col-span-4 group relative p-8 bg-zinc-900 border border-white/10 hover:border-primary-accent/50 transition-colors duration-500 flex flex-col justify-between min-h-[240px]">
            <div className="flex justify-between items-start mb-8">
              <div className="p-3 bg-zinc-800 rounded-sm text-zinc-400 group-hover:text-white transition-colors">
                <MessageSquare className="w-6 h-6" />
              </div>
              <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-primary-accent transition-colors" />
            </div>
            <div>
              <h3 className="font-mono text-lg font-bold text-zinc-200 group-hover:text-white mb-1">WhatsApp Direct</h3>
              <p className="font-sans text-zinc-400 text-xs">Message without saving contacts.</p>
            </div>
          </Link>

          {/* QR Code - Spans 4 cols */}
          <Link to="/qr-code" className="md:col-span-6 lg:col-span-4 group relative p-8 bg-zinc-900 border border-white/10 hover:border-primary-accent/50 transition-colors duration-500 flex flex-col justify-between min-h-[240px]">
            <div className="flex justify-between items-start mb-8">
              <div className="p-3 bg-zinc-800 rounded-sm text-zinc-400 group-hover:text-white transition-colors">
                <QrCode className="w-6 h-6" />
              </div>
              <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-primary-accent transition-colors" />
            </div>
            <div>
              <h3 className="font-mono text-lg font-bold text-zinc-200 group-hover:text-white mb-1">QR Code Generator</h3>
              <p className="font-sans text-zinc-400 text-xs">Instant customizable matricies.</p>
            </div>
          </Link>

          {/* File Converter - Spans 4 cols */}
          <Link to="/file-converter" className="md:col-span-6 lg:col-span-4 group relative p-8 bg-zinc-900 border border-white/10 hover:border-primary-accent/50 transition-colors duration-500 flex flex-col justify-between min-h-[240px]">
            <div className="flex justify-between items-start mb-8">
              <div className="p-3 bg-zinc-800 rounded-sm text-zinc-400 group-hover:text-white transition-colors">
                <File className="w-6 h-6" />
              </div>
              <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-primary-accent transition-colors" />
            </div>
            <div>
              <h3 className="font-mono text-lg font-bold text-zinc-200 group-hover:text-white mb-1">File Converter</h3>
              <p className="font-sans text-zinc-400 text-xs">Universal format transformation.</p>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
};

export default HomePage;
