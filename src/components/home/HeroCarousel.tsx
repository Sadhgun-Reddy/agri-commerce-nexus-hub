
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Premium Farming Equipment",
      subtitle: "Boost Your Agricultural Productivity",
      description: "Discover our range of high-quality tractors, harvesters, and farming tools designed for modern agriculture.",
      cta: "Shop Tractors",
      ctaLink: "/category/tractors",
      image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80",
      gradient: "from-brand-primary-500/90 to-brand-primary-600/90"
    },
    {
      id: 2,
      title: "Irrigation Systems",
      subtitle: "Smart Water Management Solutions",
      description: "Advanced drip irrigation and sprinkler systems to optimize water usage and maximize crop yield.",
      cta: "Explore Systems",
      ctaLink: "/category/irrigation",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      gradient: "from-blue-500/90 to-blue-600/90"
    },
    {
      id: 3,
      title: "Seeds & Fertilizers",
      subtitle: "Quality Inputs for Better Harvest",
      description: "Premium quality seeds, organic fertilizers, and plant protection products for sustainable farming.",
      cta: "View Products",
      ctaLink: "/category/seeds",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80",
      gradient: "from-green-500/90 to-green-600/90"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-16 group">
      {/* Slides */}
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="w-full h-full flex-shrink-0 relative">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />
            
            <div className="relative h-full flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-2xl text-white">
                  <div className="space-y-6 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                      {slide.title}
                    </h1>
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-medium opacity-90">
                      {slide.subtitle}
                    </h2>
                    <p className="text-lg md:text-xl opacity-80 max-w-xl">
                      {slide.description}
                    </p>
                    <div className="pt-4">
                      <Link to={slide.ctaLink}>
                        <Button 
                          size="lg" 
                          className="bg-white text-grey-800 hover:bg-grey-100 px-8 py-3 text-lg font-semibold"
                        >
                          {slide.cta}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={goToNext}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide 
                ? 'bg-white scale-110' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
