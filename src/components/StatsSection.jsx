import React, { useEffect, useState } from "react";
import { Quote, Star } from "lucide-react";

const TestimonialCard = ({ quote, name, title, rating, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`group relative p-8 bg-card-background rounded-3xl shadow-lg border border-border hover:border-primary-accent hover:shadow-2xl transition-all duration-500 hover:scale-105 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-accent/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Quote Icon */}
      <div className="relative mb-4">
        <Quote className="w-8 h-8 text-primary-accent opacity-50" />
      </div>
      
      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-primary-accent text-primary-accent" />
        ))}
      </div>
      
      {/* Quote Text */}
      <p className="text-text-body mb-6 leading-relaxed italic relative z-10">
        "{quote}"
      </p>
      
      {/* Author Info */}
      <div className="relative z-10">
        <div className="font-semibold text-text-heading">{name}</div>
        <div className="text-sm text-text-muted">{title}</div>
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

  const testimonials = [
    { 
      quote: "ToolDeck has become an essential part of my daily workflow. The QR code generator alone has saved me hours of work!",
      name: "Sarah Chen",
      title: "Marketing Director",
      rating: 5,
      delay: 0
    },
    { 
      quote: "Clean, fast, and incredibly useful. I love that I don't need to sign up or download anything. Just open and use!",
      name: "Michael Rodriguez",
      title: "Freelance Designer",
      rating: 5,
      delay: 200
    },
    { 
      quote: "The file converter is a lifesaver. I use it almost every day for my client projects. Highly recommend!",
      name: "Emily Watson",
      title: "Content Creator",
      rating: 5,
      delay: 400
    },
    { 
      quote: "Simple, powerful, and free. These tools have replaced multiple paid subscriptions for me. Absolutely fantastic!",
      name: "David Kumar",
      title: "Small Business Owner",
      rating: 5,
      delay: 600
    }
  ];

  return (
    <section className="relative bg-background py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-32 h-32 bg-primary-accent rounded-full opacity-5 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-secondary-accent rounded-full opacity-5 blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-flex items-center px-4 py-2 bg-card-background backdrop-blur-sm rounded-full text-sm font-medium text-text-body mb-6 shadow-lg border border-border">
            <Star className="w-4 h-4 text-primary-accent mr-2" />
            <span>User Testimonials</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-text-heading mb-4">
            Loved by <span className="bg-gradient-to-r from-primary-accent to-secondary-accent bg-clip-text text-transparent">thousands</span>
          </h2>
          <p className="text-xl text-text-body max-w-3xl mx-auto">
            See what our users have to say about ToolDeck
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={index} 
              {...testimonial}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
