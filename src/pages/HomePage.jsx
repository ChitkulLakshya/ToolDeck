import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { scroller } from "react-scroll";
import { 
  ArrowUp, 
  Sparkles, 
  Star, 
  Zap,
  TrendingUp,
  Shield,
  Clock,
  Award
} from "lucide-react";
import HeroSection from "../components/HeroSection";
import StatsSection from "../components/StatsSection";
import ToolsSection from "../components/ToolsSection";

const HomePage = () => {
  const location = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const particlesRef = useRef([]);

  // Handle scroll-based navigation from other pages
  useEffect(() => {
    if (location.state?.scrollTo) {
      scroller.scrollTo(location.state.scrollTo, {
        duration: 800,
        smooth: "easeInOutQuart",
        offset: -80,
      });
    }
  }, [location.state]);

  // Show/hide scroll-to-top button and track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      
      setShowScrollTop(scrollTop > 500);
      setScrollProgress(progress);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track mouse position for parallax effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Smooth scroll behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  // Generate random particles
  useEffect(() => {
    particlesRef.current = [...Array(30)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 20,
      duration: 20 + Math.random() * 30,
      icon: [Sparkles, Star, Zap][Math.floor(Math.random() * 3)],
    }));
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative overflow-hidden bg-background">
      {/* Floating Particles with Icons */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {particlesRef.current.map((particle) => {
          const IconComponent = particle.icon;
          return (
            <div
              key={particle.id}
              className="absolute animate-float opacity-0"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
              }}
            >
              <IconComponent 
                className="text-primary-accent/20" 
                size={particle.size * 8}
                style={{
                  filter: 'blur(0.5px)',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-card-background backdrop-blur-sm z-50">
        <div 
          className="h-full bg-gradient-to-r from-primary-accent to-secondary-accent transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <div id="home">
          <HeroSection />
          
          {/* Trust Badges Section */}
          <section className="relative py-12 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { icon: Shield, label: "100% Secure" },
                  { icon: Zap, label: "Lightning Fast" },
                  { icon: Clock, label: "24/7 Available" },
                  { icon: Award, label: "Award Winning" },
                ].map((badge, index) => {
                  const IconComponent = badge.icon;
                  return (
                    <div 
                      key={index}
                      className="flex flex-col items-center justify-center p-6 bg-card-background rounded-2xl shadow-lg border border-border hover:border-primary-accent hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <IconComponent className="w-8 h-8 mb-2 text-primary-accent" />
                      <span className="text-sm font-semibold text-text-heading">{badge.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <StatsSection />
          <ToolsSection />

          {/* Call-to-Action Section */}
          <section className="relative py-20 bg-card-background overflow-hidden border-y border-border">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div 
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}
              ></div>
            </div>

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="inline-flex items-center px-4 py-2 bg-background backdrop-blur-sm rounded-full text-sm font-medium text-text-body mb-6 border border-border">
                <TrendingUp className="w-4 h-4 mr-2 text-primary-accent" />
                <span>Join Thousands of Happy Users</span>
              </div>

              <h2 className="text-4xl sm:text-5xl font-extrabold text-text-heading mb-6">
                Ready to Supercharge Your Productivity?
              </h2>
              <p className="text-xl text-text-body mb-8 max-w-2xl mx-auto">
                Get started with ToolDeck today and experience the future of productivity tools.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => scroller.scrollTo("tools", {
                    duration: 800,
                    smooth: "easeInOutQuart",
                    offset: -80,
                  })}
                  className="group relative px-8 py-4 bg-primary-accent text-white font-semibold rounded-2xl text-lg shadow-xl hover:shadow-2xl hover:opacity-90 transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  <div className="relative flex items-center justify-center">
                    <span>Explore Tools</span>
                    <Sparkles className="ml-3 w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                </button>

                <button className="px-8 py-4 bg-background backdrop-blur-sm text-text-heading font-semibold rounded-2xl text-lg border-2 border-border hover:border-primary-accent hover:bg-card-background transition-all duration-300 hover:scale-105">
                  Learn More
                </button>
              </div>

              {/* Social Proof */}
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-text-body">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div 
                        key={i}
                        className="w-10 h-10 rounded-full border-2 border-card-background bg-gradient-to-br from-primary-accent to-secondary-accent"
                      ></div>
                    ))}
                  </div>
                  <span className="text-sm font-medium">10,000+ Active Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary-accent text-primary-accent" />
                    ))}
                  </div>
                  <span className="text-sm font-medium">4.9/5 Rating</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Enhanced Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-primary-accent text-white rounded-full shadow-xl hover:shadow-2xl hover:opacity-90 transition-all duration-300 hover:scale-110 group"
          style={{
            animation: 'bounce 2s infinite',
          }}
        >
          <ArrowUp className="w-6 h-6 mx-auto group-hover:-translate-y-1 transition-transform duration-300" />
          
          {/* Progress Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 56 56">
            <circle
              cx="28"
              cy="28"
              r="26"
              fill="none"
              stroke="white"
              strokeWidth="2"
              opacity="0.2"
            />
            <circle
              cx="28"
              cy="28"
              r="26"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeDasharray={`${2 * Math.PI * 26}`}
              strokeDashoffset={`${2 * Math.PI * 26 * (1 - scrollProgress / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>
        </button>
      )}

      {/* Custom Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          50% {
            transform: translateY(-30px) rotate(180deg);
            opacity: 0.8;
          }
          90% {
            opacity: 0.3;
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        .animate-float {
          animation: float linear infinite;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
        
        .delay-500 {
          animation-delay: 0.5s;
        }

        /* Smooth scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: linear-gradient(to bottom, #f0f9ff, #faf5ff);
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }
      `}</style>
    </div>
  );
};

export default HomePage;
