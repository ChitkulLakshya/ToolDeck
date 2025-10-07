import React from "react";
import { Heart } from "lucide-react";

const Footer = () => (
  <footer className="bg-cyan-50 py-12 border-t border-cyan-100 text-center text-gray-700">
    <p className="text-lg font-semibold mb-2">
      Made with <Heart className="inline w-5 h-5 text-red-500 mb-1" /> by the ToolDeck Team.
    </p>
    <p className="text-sm">&copy; 2025 ToolDeck. All rights reserved.</p>
  </footer>
);

export default Footer;
