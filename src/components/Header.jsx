import React from "react";
import { Link } from "react-router-dom";
import { Bot } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  return (
    <header className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Bot className="w-6 h-6 text-primary-accent" />
            <span className="text-xl font-bold text-text-heading">ToolDeck</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/" className="text-text-body hover:text-primary-accent font-medium">Home</Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
