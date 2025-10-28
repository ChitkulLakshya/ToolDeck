import React from "react";
import { Loader2, Sparkles } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-2xl opacity-50 animate-pulse"></div>
          <div className="relative bg-white p-8 rounded-3xl shadow-2xl">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto" />
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
          Loading ToolDeck
        </h2>
        <p className="text-gray-600 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
          <span>Preparing your workspace...</span>
        </p>

        {/* Progress Bar */}
        <div className="mt-8 w-64 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-progress"></div>
        </div>
      </div>

      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
