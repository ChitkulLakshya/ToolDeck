import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Bot } from "lucide-react";
import { scroller } from "react-scroll"; // for programmatic scroll

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleScroll = (id) => {
    if (location.pathname === "/") {
      // If already on home page, scroll to section
      scroller.scrollTo(id, {
        duration: 800,
        smooth: "easeInOutQuart",
        offset: -64, // adjust for fixed header
      });
    } else {
      // Navigate to home page with target section in state
      navigate("/", { state: { scrollTo: id } });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo navigates to home page */}
        <Link to="/" className="flex items-center space-x-2 text-xl font-extrabold text-gray-900">
          <Bot className="w-6 h-6 text-cyan-500" />
          <span>ToolDeck</span>
        </Link>

        {/* Navigation Menu */}
        <nav className="hidden md:flex space-x-8">
          <button
            onClick={() => handleScroll("home")}
            className="text-gray-700 hover:text-cyan-500 font-medium transition-colors cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={() => handleScroll("tools")}
            className="text-gray-700 hover:text-cyan-500 font-medium transition-colors cursor-pointer"
          >
            Tools
          </button>
          <Link to="/about" className="text-gray-700 hover:text-cyan-500 font-medium transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-cyan-500 font-medium transition-colors">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
