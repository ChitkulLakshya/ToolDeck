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
    <section id="home" className="relative pt-32 pb-20 bg-background text-text-body min-h-screen flex items-center overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <Aurora 
          colorStops={['#3b82f6', '#2dd4bf', '#3b82f6']}
          amplitude={1.2}
          blend={1}
          speed={0.8}
        />
      </div>
      
      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/30 to-background/50"></div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-bounce delay-100">
          <Sparkles className="w-6 h-6 text-primary-accent opacity-40" />
        </div>
        <div className="absolute top-40 right-20 animate-bounce delay-300">
          <Star className="w-5 h-5 text-secondary-accent opacity-40" />
        </div>
        <div className="absolute bottom-40 left-20 animate-bounce delay-700">
          <Sparkles className="w-4 h-4 text-primary-accent opacity-40" />
        </div>
        <div className="absolute bottom-20 right-10 animate-bounce delay-500">
          <Star className="w-6 h-6 text-secondary-accent opacity-40" />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-card-background backdrop-blur-sm rounded-full text-sm font-medium text-text-body mb-8 shadow-lg border border-border">
            <Sparkles className="w-4 h-4 text-primary-accent mr-2" />
            <span>Trusted by thousands of users worldwide</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-8 leading-tight">
            <span className="block text-text-heading">All your daily tools</span>
            <span className="block bg-gradient-to-r from-primary-accent to-secondary-accent bg-clip-text text-transparent">
              in one place
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-text-body mb-12 max-w-4xl mx-auto leading-relaxed">
            Transform your productivity with our suite of powerful, easy-to-use tools. 
            <span className="font-semibold text-text-heading"> No downloads, no installations</span> - just pure efficiency.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="flex items-center space-x-2 px-6 py-3 bg-card-background backdrop-blur-sm rounded-full shadow-lg border border-border hover:border-primary-accent hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <IconComponent className="w-5 h-5 text-primary-accent" />
                  <span className="font-medium text-text-body">{feature.text}</span>
                </div>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={scrollToTools}
              className="group relative px-8 py-4 bg-primary-accent text-white font-semibold rounded-2xl text-lg shadow-xl hover:shadow-2xl hover:opacity-90 transition-all duration-300 hover:scale-105 overflow-hidden"
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
              <div className="text-3xl font-bold text-text-heading mb-2">6+</div>
              <div className="text-text-body">Powerful Tools</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-text-heading mb-2">∞</div>
              <div className="text-text-body">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-text-heading mb-2">100%</div>
              <div className="text-text-body">Free Forever</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
