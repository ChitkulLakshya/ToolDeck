import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

/**
 * Standalone Toast Component
 * Use when you don't want to use the context (e.g., for local state)
 */
const Toast = ({ 
  message, 
  type = 'info', 
  visible = false, 
  onClose,
  duration = 5000,
  position = 'top-right' 
}) => {
  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  if (!visible) return null;

  const config = {
    success: {
      icon: CheckCircle,
      bgClass: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700',
      iconClass: 'text-green-600 dark:text-green-400',
      textClass: 'text-green-900 dark:text-green-100'
    },
    error: {
      icon: AlertCircle,
      bgClass: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700',
      iconClass: 'text-red-600 dark:text-red-400',
      textClass: 'text-red-900 dark:text-red-100'
    },
    warning: {
      icon: AlertTriangle,
      bgClass: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700',
      iconClass: 'text-yellow-600 dark:text-yellow-400',
      textClass: 'text-yellow-900 dark:text-yellow-100'
    },
    info: {
      icon: Info,
      bgClass: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700',
      iconClass: 'text-blue-600 dark:text-blue-400',
      textClass: 'text-blue-900 dark:text-blue-100'
    }
  };

  const { icon: Icon, bgClass, iconClass, textClass } = config[type];

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-[9999] animate-slideIn max-w-md`}>
      <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm ${bgClass}`}>
        <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconClass}`} />
        <p className={`flex-1 text-sm font-medium ${textClass}`}>{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;
