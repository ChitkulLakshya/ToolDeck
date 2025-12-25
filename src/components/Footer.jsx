import React from "react";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-text-muted text-sm">
        &copy; {new Date().getFullYear()} ToolDeck. Internal Productivity Tools.
      </div>
    </footer>
  );
};

export default Footer;
