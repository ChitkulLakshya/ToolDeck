import React from "react";
import { Loader2, Sparkles, Zap } from "lucide-react";

/**
 * LoadingSpinner Component
 * Reusable loading indicator with multiple variants
 */
const LoadingSpinner = ({ 
  size = "default", 
  variant = "page",
  message = "Loading...",
  showMessage = true 
}) => {
  // Size classes
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-8 h-8",
    large: "w-16 h-16"
  };

  // Inline spinner (for buttons, inline content)
  if (variant === "inline") {
    return (
      <Loader2 className={`${sizeClasses[size]} animate-spin text-current`} />
    );
  }

  // Overlay spinner (for modal/form overlays)
  if (variant === "overlay") {
    return (
      <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-xl">
        <div className="text-center">
          <Loader2 className={`${sizeClasses.large} text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-2`} />
          {showMessage && (
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{message}</p>
          )}
        </div>
      </div>
    );
  }

  // Card spinner (for loading within cards)
  if (variant === "card") {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
          <div className="relative bg-white dark:bg-gray-800 p-4 rounded-full shadow-lg">
            <Loader2 className={`${sizeClasses.default} text-blue-600 dark:text-blue-400 animate-spin`} />
          </div>
        </div>
        {showMessage && (
          <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
        )}
      </div>
    );
  }

  // Skeleton loader (for content placeholders)
  if (variant === "skeleton") {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
      </div>
    );
  }

  // Full page spinner (default)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-2xl opacity-50 animate-pulse"></div>
          <div className="relative bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl">
            <Loader2 className="w-16 h-16 text-blue-600 dark:text-blue-400 animate-spin mx-auto" />
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
          Loading ToolDeck
        </h2>
        {showMessage && (
          <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
            <span>{message}</span>
          </p>
        )}

        {/* Progress Bar */}
        <div className="mt-8 w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mx-auto">
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

// Export variants as separate components for convenience
export const InlineLoader = (props) => <LoadingSpinner variant="inline" {...props} />;
export const OverlayLoader = (props) => <LoadingSpinner variant="overlay" {...props} />;
export const CardLoader = (props) => <LoadingSpinner variant="card" {...props} />;
export const SkeletonLoader = (props) => <LoadingSpinner variant="skeleton" {...props} />;

export default LoadingSpinner;
