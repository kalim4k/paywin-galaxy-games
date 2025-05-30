
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const GameSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const slides = [
    {
      id: 1,
      title: "MINE",
      subtitle: "Trouvez les diamants cachés",
      gradient: "from-blue-500 to-purple-600",
      image: "https://orawin.fun/wp-content/uploads/2025/05/MAGIC-4.png",
      route: "/mine"
    },
    {
      id: 2,
      title: "LUCKY JET",
      subtitle: "Montez jusqu'aux étoiles",
      gradient: "from-orange-500 to-red-600", 
      image: "https://orawin.fun/wp-content/uploads/2025/05/MAGIC-2.png",
      route: "/game-not-available/lucky-jet"
    },
    {
      id: 3,
      title: "DICE",
      subtitle: "Lancez les dés de la fortune",
      gradient: "from-green-500 to-emerald-600",
      image: "https://orawin.fun/wp-content/uploads/2025/05/MAGIC-1.png",
      route: "/dice"
    },
    {
      id: 4,
      title: "PLINKO",
      subtitle: "Faites tomber la balle gagnante",
      gradient: "from-pink-500 to-violet-600",
      image: "https://orawin.fun/wp-content/uploads/2025/05/MAGIC-3.png",
      route: "/game-not-available/plinko"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="px-4 py-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-800 to-gray-900 h-48">
        <div 
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              className={`min-w-full bg-gradient-to-r ${slide.gradient} flex items-center justify-between p-6 relative overflow-hidden`}
            >
              <div className="z-10">
                <h3 className="text-white text-2xl font-bold mb-2">{slide.title}</h3>
                <p className="text-white/90 text-sm mb-4">{slide.subtitle}</p>
                <button 
                  onClick={() => navigate(slide.route)}
                  className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-medium hover:bg-white/30 transition-all"
                >
                  Jouer maintenant
                </button>
              </div>
              <div className="w-20 h-20 flex-shrink-0">
                <img 
                  src={slide.image} 
                  alt={slide.title}
                  className="w-full h-full object-cover rounded-lg opacity-80"
                />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full transform -translate-x-12 translate-y-12"></div>
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/50 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/50 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
