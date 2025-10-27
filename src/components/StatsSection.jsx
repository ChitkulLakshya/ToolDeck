import React, { useEffect, useState } from "react";
import { QrCode, Users, Heart, Zap, Star, TrendingUp } from "lucide-react";

const ToolStatPill = ({ icon: Icon, value, label, colorClass, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (isVisible) {
      const numericValue = parseInt(value);
      if (!isNaN(numericValue)) {
        const increment = numericValue / 50;
        const timer = setInterval(() => {
          setCount(prev => {
            if (prev >= numericValue) {
              clearInterval(timer);
              return numericValue;
            }
            return Math.min(prev + increment, numericValue);
          });
        }, 20);
        return () => clearInterval(timer);
      }
    }
  }, [isVisible, value]);

  return (
    <div className={`group relative p-6 m-2 flex flex-col items-center justify-center rounded-3xl shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-2xl ${colorClass} min-w-[180px] ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Icon with Animation */}
      <div className="relative mb-4">
        <div className="absolute inset-0 bg-white/30 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-8 h-8 text-gray-700" />
        </div>
      </div>
      
      {/* Value */}
      <span className="text-3xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors duration-300">
        {isNaN(parseInt(value)) ? value : Math.floor(count)}
        {!isNaN(parseInt(value)) && value.includes('+') && '+'}
      </span>
      
      {/* Label */}
      <span className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
        {label}
      </span>
      
      {/* Decorative Elements */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Star className="w-4 h-4 text-yellow-500" />
      </div>
    </div>
  );
};

const StatsSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { 
      icon: QrCode, 
      value: "6+", 
      label: "Powerful Tools", 
      colorClass: "bg-gradient-to-br from-blue-100 to-blue-200 border border-blue-200",
      delay: 0
    },
    { 
      icon: Users, 
      value: "∞", 
      label: "Happy Users", 
      colorClass: "bg-gradient-to-br from-pink-100 to-pink-200 border border-pink-200",
      delay: 200
    },
    { 
      icon: Heart, 
      value: "100%", 
      label: "Free Forever", 
      colorClass: "bg-gradient-to-br from-green-100 to-green-200 border border-green-200",
      delay: 400
    },
    { 
      icon: Zap, 
      value: "99.9%", 
      label: "Uptime", 
      colorClass: "bg-gradient-to-br from-purple-100 to-purple-200 border border-purple-200",
      delay: 600
    },
    { 
      icon: TrendingUp, 
      value: "24/7", 
      label: "Available", 
      colorClass: "bg-gradient-to-br from-orange-100 to-orange-200 border border-orange-200",
      delay: 800
    }
  ];

  return (
    <section className="relative bg-gradient-to-br from-gray-50 to-blue-50 py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Trusted by <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">millions</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of users who rely on ToolDeck for their daily productivity needs
          </p>
        </div>

        {/* Stats Grid */}
        <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
          {stats.map((stat, index) => (
            <ToolStatPill 
              key={index} 
              {...stat}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-12 transition-all duration-700 delay-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <p className="text-gray-600 mb-4">Ready to boost your productivity?</p>
          <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
            <Zap className="w-5 h-5 mr-2" />
            Get Started Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
