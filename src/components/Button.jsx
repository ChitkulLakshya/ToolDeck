import React from "react";

/**
 * Standardized Button Component using CSS Variables
 * 
 * @param {string} variant - "primary" | "secondary" | "outline" | "ghost"
 * @param {string} size - "sm" | "md" | "lg"
 * @param {boolean} fullWidth - Makes button full width
 * @param {React.ReactNode} children - Button content
 * @param {React.ReactNode} icon - Optional icon component
 * @param {string} className - Additional custom classes
 */
const Button = ({ 
  variant = "primary", 
  size = "md", 
  fullWidth = false,
  children,
  icon: Icon,
  className = "",
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100";
  
  const variantClasses = {
    primary: "bg-primary-accent text-white hover:opacity-90",
    secondary: "bg-secondary-accent text-white hover:opacity-90",
    outline: "bg-transparent border-2 border-border text-text-heading hover:border-primary-accent hover:bg-card-background",
    ghost: "bg-transparent text-text-body hover:bg-card-background",
  };
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };
  
  const widthClass = fullWidth ? "w-full" : "";
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
      {Icon && <Icon className="ml-2 w-5 h-5" />}
    </button>
  );
};

export default Button;
