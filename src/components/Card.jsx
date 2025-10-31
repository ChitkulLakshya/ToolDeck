import React from "react";

/**
 * Standardized Card Component using CSS Variables
 * 
 * @param {React.ReactNode} children - Card content
 * @param {boolean} hover - Enable hover effects
 * @param {string} padding - "sm" | "md" | "lg"
 * @param {string} className - Additional custom classes
 */
const Card = ({ 
  children, 
  hover = false,
  padding = "md",
  className = "",
  ...props 
}) => {
  const baseClasses = "bg-card-background rounded-3xl shadow-lg border border-border transition-all duration-300";
  
  const hoverClasses = hover 
    ? "hover:border-primary-accent hover:shadow-2xl hover:scale-105 hover:-translate-y-1 cursor-pointer" 
    : "";
  
  const paddingClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };
  
  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${paddingClasses[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
