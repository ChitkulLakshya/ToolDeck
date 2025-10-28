import React, { useEffect, useState } from "react";
import { ArrowRight, Sparkles, Zap, Star, Users, Clock } from "lucide-react";
import { scroller } from "react-scroll";
import Aurora from "./Aurora";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToTools = () => {
    scroller.scrollTo("tools", {
      duration: 800,
      smooth: "easeInOutQuart",
      offset: -80,
    });
  };

  const features = [
    { icon: Zap, text: "Lightning Fast" },
    { icon: Users, text: "User Friendly" },
    { icon: Clock, text: "Save Time" }
  ];

  return (
    <section id="home" className="relative pt-32 pb-20 bg-[#111827] text-gray-100 min-h-screen flex items-center overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <Aurora 
          colorStops={['#3b82f6', '#2dd4bf', '#3b82f6']}
          amplitude={1.2}
          blend={0.6}
          speed={0.8}
        />
      </div>
      
      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#111827]/50 via-[#111827]/30 to-[#111827]/50"></div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-bounce delay-100">
          <Sparkles className="w-6 h-6 text-[#3B82F6] opacity-40" />
        </div>
        <div className="absolute top-40 right-20 animate-bounce delay-300">
          <Star className="w-5 h-5 text-[#2DD4BF] opacity-40" />
        </div>
        <div className="absolute bottom-40 left-20 animate-bounce delay-700">
          <Sparkles className="w-4 h-4 text-[#3B82F6] opacity-40" />
        </div>
        <div className="absolute bottom-20 right-10 animate-bounce delay-500">
          <Star className="w-6 h-6 text-[#2DD4BF] opacity-40" />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-[#1F2937] backdrop-blur-sm rounded-full text-sm font-medium text-[#D1D5DB] mb-8 shadow-lg border border-[#374151]">
            <Sparkles className="w-4 h-4 text-[#3B82F6] mr-2" />
            <span>Trusted by thousands of users worldwide</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-8 leading-tight">
            <span className="block text-[#F9FAFB]">All your daily tools</span>
            <span className="block bg-gradient-to-r from-[#3B82F6] to-[#2DD4BF] bg-clip-text text-transparent">
              in one place
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-[#D1D5DB] mb-12 max-w-4xl mx-auto leading-relaxed">
            Transform your productivity with our suite of powerful, easy-to-use tools. 
            <span className="font-semibold text-[#F9FAFB]"> No downloads, no installations</span> - just pure efficiency.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="flex items-center space-x-2 px-6 py-3 bg-[#1F2937] backdrop-blur-sm rounded-full shadow-lg border border-[#374151] hover:border-[#3B82F6] hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <IconComponent className="w-5 h-5 text-[#3B82F6]" />
                  <span className="font-medium text-[#D1D5DB]">{feature.text}</span>
                </div>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={scrollToTools}
              className="group relative px-8 py-4 bg-[#3B82F6] text-white font-semibold rounded-2xl text-lg shadow-xl hover:shadow-2xl hover:bg-[#2563EB] transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <div className="relative flex items-center">
                <span>Get Started</span>
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#F9FAFB] mb-2">6+</div>
              <div className="text-[#D1D5DB]">Powerful Tools</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#F9FAFB] mb-2">∞</div>
              <div className="text-[#D1D5DB]">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#F9FAFB] mb-2">100%</div>
              <div className="text-[#D1D5DB]">Free Forever</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
