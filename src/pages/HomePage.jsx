import React from "react";
import { Link } from "react-router-dom";
import { QrCode, MessageSquare, Mail, FileText, File, ArrowRight } from "lucide-react";

const HomePage = () => {
  const tools = [
    { 
      title: "QR Code Generator", 
      icon: QrCode, 
      description: "Create customizable QR codes instantly.", 
      to: "/qr-code"
    },
    { 
      title: "WhatsApp Direct", 
      icon: MessageSquare, 
      description: "Send messages without saving contacts.", 
      to: "/whatsapp"
    },
    { 
      title: "AI Email Generator", 
      icon: Mail, 
      description: "Compose professional emails with AI.", 
      to: "/email"
    },
    { 
      title: "PDF Editor", 
      icon: FileText, 
      description: "View and annotate PDF files.", 
      to: "/pdf-editor"
    },
    { 
      title: "File Converter", 
      icon: File, 
      description: "Convert files between formats.", 
      to: "/file-converter"
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center md:text-left">
          <h1 className="text-4xl font-bold text-text-heading mb-4">ToolDeck</h1>
          <p className="text-xl text-text-body">Essential productivity tools for everyday tasks.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, idx) => (
            <Link
              key={idx}
              to={tool.to}
              className="group block bg-card-background p-6 rounded-xl border border-border hover:border-primary-accent hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-primary-accent/10 text-primary-accent group-hover:bg-primary-accent group-hover:text-white transition-colors">
                  <tool.icon className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-primary-accent transition-colors" />
              </div>
              
              <h3 className="text-lg font-semibold text-text-heading mb-2">
                {tool.title}
              </h3>
              <p className="text-text-body text-sm">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
