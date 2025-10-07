import React from "react";
import { QrCode, MessageSquare, Mail, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom"; // use for navigation

const ToolCard = ({ colorClass, icon: Icon, title, description, to }) => (
  <Link
    to={to}
    className={`block ${colorClass} p-8 rounded-[24px] shadow-xl hover:shadow-2xl transition duration-300 transform hover:scale-[1.03]`}
  >
    <div className="flex items-center mb-4">
      <div className="p-3 rounded-full bg-white shadow-md">
        <Icon className="w-6 h-6 text-gray-900" />
      </div>
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-700">{description}</p>
    <div className="mt-4 flex items-center text-sm font-semibold text-gray-800">
      Launch Tool <ArrowRight className="ml-2 w-4 h-4" />
    </div>
  </Link>
);

export default function ToolsSection() {
  const tools = [
    { title: "QR Code Generator", icon: QrCode, description: "Create QR codes instantly.", colorClass: "bg-pink-100", to: "/qr-code" },
    { title: "WhatsApp Message", icon: MessageSquare, description: "Send WhatsApp messages.", colorClass: "bg-green-100", to: "/whatsapp" },
    { title: "Email Generator", icon: Mail, description: "Compose professional emails.", colorClass: "bg-purple-100", to: "/email" }
  ];

  return (
    <section id="tools" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            Choose your Tool
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Simple, powerful utilities designed to save you time and effort.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tools.map((tool, idx) => (
            <ToolCard key={idx} {...tool} />
          ))}
        </div>
      </div>
    </section>
  );
}
