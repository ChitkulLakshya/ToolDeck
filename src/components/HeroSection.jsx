import React from "react";
import { ArrowRight } from "lucide-react";

const HeroSection = () => (
  <section id="home" className="pt-24 pb-20 bg-cyan-50 text-gray-900 min-h-screen flex items-center">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6">
        All your daily tools in <span className="text-cyan-500">one place</span>
      </h1>
      <a
        href="#tools"
        className="inline-flex items-center px-8 py-3 bg-cyan-200 rounded-2xl text-lg font-semibold hover:bg-cyan-300"
      >
        Get Started <ArrowRight className="ml-3 w-5 h-5" />
      </a>
    </div>
  </section>
);

export default HeroSection;
