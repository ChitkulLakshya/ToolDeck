import React from "react";

/**
 * Standardized Badge Component using CSS Variables
 * 
 * @param {React.ReactNode} children - Badge content
 * @param {React.ReactNode} icon - Optional icon component
 * @param {string} variant - "default" | "primary" | "success" | "warning" | "error"
 * @param {string} size - "sm" | "md" | "lg"
 * @param {string} className - Additional custom classes
 */
const Badge = ({ 
  children, 
  icon: Icon,
  variant = "default",
  size = "md",
  className = "",
  ...props 
}) => {
  const baseClasses = "inline-flex items-center backdrop-blur-sm rounded-full font-medium shadow-lg border";
  
  const variantClasses = {
    default: "bg-card-background text-text-body border-border",
    primary: "bg-primary-accent/10 text-primary-accent border-primary-accent/20",
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    error: "bg-error/10 text-error border-error/20",
  };
  
  const sizeClasses = {
    sm: "px-3 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };
  
  const iconSizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };
  
  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className={`${iconSizeClasses[size]} mr-2`} />}
      {children}
    </div>
  );
};

export default Badge;
