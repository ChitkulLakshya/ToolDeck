import React from "react";
import { Link } from "react-router-dom";
import { Home, Search, ArrowLeft, Sparkles } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-blue-400 rounded-full opacity-20 blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <h1 className="text-[180px] font-extrabold leading-none bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            404
          </h1>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
            <h2 className="text-4xl font-bold text-gray-900">Page Not Found</h2>
            <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
          </div>
          <p className="text-xl text-gray-600 mb-12 max-w-md mx-auto">
            Oops! The page you're looking for seems to have wandered off into the digital void.
          </p>
        </div>

        {/* Search Suggestions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center gap-2">
            <Search className="w-5 h-5 text-blue-600" />
            Popular Tools
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Link
              to="/qr-code"
              className="px-4 py-3 bg-gradient-to-r from-pink-100 to-pink-200 rounded-xl text-gray-800 font-medium hover:from-pink-200 hover:to-pink-300 transition-all duration-300 hover:scale-105"
            >
              QR Generator
            </Link>
            <Link
              to="/whatsapp"
              className="px-4 py-3 bg-gradient-to-r from-green-100 to-green-200 rounded-xl text-gray-800 font-medium hover:from-green-200 hover:to-green-300 transition-all duration-300 hover:scale-105"
            >
              WhatsApp
            </Link>
            <Link
              to="/email"
              className="px-4 py-3 bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl text-gray-800 font-medium hover:from-purple-200 hover:to-purple-300 transition-all duration-300 hover:scale-105"
            >
              Email Generator
            </Link>
            <Link
              to="/pdf-editor"
              className="px-4 py-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl text-gray-800 font-medium hover:from-blue-200 hover:to-blue-300 transition-all duration-300 hover:scale-105"
            >
              PDF Editor
            </Link>
            <Link
              to="/file-converter"
              className="px-4 py-3 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-xl text-gray-800 font-medium hover:from-indigo-200 hover:to-indigo-300 transition-all duration-300 hover:scale-105"
            >
              File Converter
            </Link>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-300 hover:border-gray-400 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
