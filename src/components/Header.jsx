import React from "react";
import { Link } from "react-router-dom";
import { Bot } from "lucide-react";

// Use "to" instead of "href"
const NavLink = ({ to, children }) => (
  <Link 
    to={to} 
    className="text-gray-600 hover:text-gray-900 transition duration-150 p-2 rounded-lg hover:bg-cyan-100"
  >
    {children}
  </Link>
);

const Header = () => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      {/* Logo navigates to home page */}
      <Link to="/" className="flex items-center space-x-2 text-xl font-extrabold text-gray-900">
        <Bot className="w-6 h-6 text-cyan-500" />
        <span>ToolDeck</span>
      </Link>

      {/* Navigation Menu */}
      <nav className="hidden md:flex space-x-4">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/#tools">Tools</NavLink>
        <NavLink to="/#about">About</NavLink>
        <NavLink to="/#contact">Contact</NavLink>
      </nav>
    </div>
  </header>
);

export default Header;
