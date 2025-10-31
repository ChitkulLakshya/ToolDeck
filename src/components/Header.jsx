import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Bot, Menu, X, Sparkles } from "lucide-react";
import { scroller } from "react-scroll";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScroll = (id) => {
    setIsMobileMenuOpen(false);
    if (location.pathname === "/") {
      scroller.scrollTo(id, {
        duration: 800,
        smooth: "easeInOutQuart",
        offset: -80,
      });
    } else {
      navigate("/", { state: { scrollTo: id } });
    }
  };

  const navItems = [
    { label: "Home", action: () => handleScroll("home") },
    { label: "Tools", action: () => handleScroll("tools") },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-background/95 backdrop-blur-md shadow-lg border-b border-border' 
        : 'bg-background/80 backdrop-blur-sm shadow-sm border-b border-border/50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-accent to-secondary-accent rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-background p-2 rounded-xl shadow-lg">
                <Bot className="w-6 h-6 text-primary-accent" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-gradient-to-r from-primary-accent to-secondary-accent bg-clip-text text-transparent">
                ToolDeck
              </span>
              <Sparkles className="w-4 h-4 text-warning animate-pulse" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <div key={index}>
                {item.to ? (
                  <Link
                    to={item.to}
                    className="relative px-4 py-2 text-text-body hover:text-primary-accent font-medium transition-all duration-200 group"
                  >
                    <span className="relative z-10">{item.label}</span>
                    <div className="absolute inset-0 bg-primary-accent/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  </Link>
                ) : (
                  <button
                    onClick={item.action}
                    className="relative px-4 py-2 text-text-body hover:text-primary-accent font-medium transition-all duration-200 group"
                  >
                    <span className="relative z-10">{item.label}</span>
                    <div className="absolute inset-0 bg-primary-accent/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  </button>
                )}
              </div>
            ))}
            
            {/* Theme Toggle */}
            <ThemeToggle />
          </nav>

          {/* Mobile Menu Button + Theme Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-card-background transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-text-body" />
              ) : (
                <Menu className="w-6 h-6 text-text-body" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <nav className="py-4 space-y-2 border-t border-border">
            {navItems.map((item, index) => (
              <div key={index}>
                {item.to ? (
                  <Link
                    to={item.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-text-body hover:text-primary-accent hover:bg-card-background rounded-lg font-medium transition-all duration-200"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      item.action();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-text-body hover:text-primary-accent hover:bg-card-background rounded-lg font-medium transition-all duration-200"
                  >
                    {item.label}
                  </button>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
