
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
      image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg5YZAtLfX4wMQo9y1EvuKL2W0gud4xPP5hfRRaLwK3T290V7edbR4eWlojqZBLXcLgMwpJ7e24DFS36DtwT27VKpTR5bfXHHpWZ0PJizecgYrPthPw-iupGM0Cr8whCjJYXsu4MmN-62ruuvhLF8kaKlA_PR3Op5DJ5wNT7hS2LblDnXabnpMHxk2aZGLG/s512/MAGIC%20(4).png",
      path: "/mine"
    },
    {
      id: 2,
      title: "LUCKY JET",
      subtitle: "Montez jusqu'aux étoiles",
      gradient: "from-orange-500 to-red-600", 
      image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj1Ew9dm2PFG3k3FpcA_zfkkn31C0r48NtktvBoc9eqiMgC-zfimrq84LlFWNG8fWR79r3kD0I0RZG39wmGBLywu61UeZyXelWqi4jkliocZS9Wr88s9G6Z0B9fD7GnHr7CdgANpa6ql9qPIpwjhmAHIWghlMOPMHBRCyAcrTNVkcHUxdj3Ma0hFbwtfNMK/s512/MAGIC%20(2).png",
      path: "/game-not-available/lucky-jet"
    },
    {
      id: 3,
      title: "DICE",
      subtitle: "Lancez les dés de la fortune",
      gradient: "from-green-500 to-emerald-600",
      image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEglmU5-UPuOlo5pWn_24IYjCo1zkAQY4wVN1uonbyc2Tz4j8JBjmBNNoEaULweB04xZgfr7WZxf8M3fkpD0jHccclzpvbpJtHXbHaRR6pRTJ7wFEIcs1eNYWnYphgAWK5VN_hBnLJMdvD01MjiCecsJ6PGn2KlcvLSFoVROI59YrGKdR-zQ3miuCZTdSw6h/s512/MAGIC%20(1).png",
      path: "/dice"
    },
    {
      id: 4,
      title: "PLINKO",
      subtitle: "Faites tomber la balle gagnante",
      gradient: "from-pink-500 to-violet-600",
      image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi4FducspGRLuJlT1ouGXvB4WVx9nwKc7BICHQoMkDf7m7g-RmK0VmirRqNYwrO2scLcD3f6-WbbPhi4SS9umP5bWZ4Y1u2tExKKJENO7_3mguDMa8jtWAqpdB4DQjMTjjrTgM4vp5bf-lL7DDIJehAhlw5zOU3qrqQMyMqAhEVcgzDe4ckty1O9skwV1fB/s512/MAGIC%20(3).png",
      path: "/game-not-available/plinko"
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

  const handlePlayNow = () => {
    navigate(slides[currentSlide].path);
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
                  onClick={handlePlayNow}
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
