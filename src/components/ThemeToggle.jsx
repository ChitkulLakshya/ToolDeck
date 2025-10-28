import React, { useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme, setLightTheme, setDarkTheme, setSystemTheme, mounted } = useTheme();
  const [showOptions, setShowOptions] = useState(false);

  // Prevent flash on initial render
  if (!mounted) {
    return <div className={`w-10 h-10 ${className}`} />;
  }

  return (
    <div className="relative">
      {/* Simple Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 ${className}`}
        aria-label="Toggle theme"
        title={`Current theme: ${theme}`}
      >
        {theme === 'dark' ? (
          <Moon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        ) : (
          <Sun className="w-5 h-5 text-yellow-600" />
        )}
      </button>

      {/* Advanced Options Dropdown (Optional) */}
      {showOptions && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
          <button
            onClick={() => {
              setLightTheme();
              setShowOptions(false);
            }}
            className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              theme === 'light' ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
          >
            <Sun className="w-4 h-4" />
            <span className="text-sm font-medium dark:text-white">Light</span>
          </button>
          
          <button
            onClick={() => {
              setDarkTheme();
              setShowOptions(false);
            }}
            className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              theme === 'dark' ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
          >
            <Moon className="w-4 h-4" />
            <span className="text-sm font-medium dark:text-white">Dark</span>
          </button>
          
          <button
            onClick={() => {
              setSystemTheme();
              setShowOptions(false);
            }}
            className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Monitor className="w-4 h-4" />
            <span className="text-sm font-medium dark:text-white">System</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
