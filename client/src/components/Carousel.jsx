import React, { useState, useEffect } from 'react';

import appHero from '../assets/app_hero.png';
import medicalHero from '../assets/medical_hero.png';

const Carousel = ({ onAddClick, onProfileClick, onExploreClick, onExerciseClick, onUpdateGoalsClick }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      title: "The Future of Care",
      desc: "Experience AI-powered medicine tracking and health insights.",
      btn: "Explore Now",
      action: onExploreClick,
      bg: "linear-gradient(135deg, #0f172a, #334155)",
      image: appHero
    },
    {
      title: "Keep Track",
      desc: "Of all medications you take daily.",
      btn: "Add Medicine",
      action: onAddClick,
      bg: "linear-gradient(135deg, #1e40af, #3b82f6)",
      image: "/assets/pill.png"
    },
    {
      title: "Stay Healthy",
      desc: "Never miss a dose with smart alerts.",
      btn: "Check Profile",
      action: onProfileClick,
      bg: "linear-gradient(135deg, #065f46, #10b981)",
      image: "/assets/bottle.png"
    },
    {
      title: "Smart Recovery",
      desc: "Advanced analytics for your fitness and recovery journey.",
      btn: "Join Session",
      action: onExerciseClick,
      bg: "linear-gradient(135deg, #064e3b, #059669)",
      image: medicalHero
    },
    {
      title: "Heart Health",
      desc: "Track your health metrics seamlessly.",
      btn: "Update Goals",
      action: onUpdateGoalsClick,
      bg: "linear-gradient(135deg, #5b21b6, #8b5cf6)",
      image: "/assets/heart.png"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="carousel-container">
      <div className="carousel-viewport">
        {slides.map((slide, i) => (
          <div 
            key={i}
            className="carousel-slide" 
            style={{ 
              background: slide.bg, 
              display: i === activeSlide ? 'flex' : 'none' 
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '2rem' }}>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>{slide.title}</h2>
                <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '2rem' }}>{slide.desc}</p>
                <button 
                   onClick={slide.action}
                   style={{ padding: '0.8rem 2rem', background: 'white', color: 'var(--primary)', borderRadius: '1rem', fontWeight: 800 }}
                >
                  {slide.btn}
                </button>
              </div>
              <img 
                src={slide.image} 
                className="animate-float" 
                style={{ width: '220px', height: 'auto', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.3))' }} 
                alt="" 
              />
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', bottom: '20px', left: '3rem', display: 'flex', gap: '8px' }}>
        {slides.map((_, i) => (
          <div 
            key={i} 
            onClick={() => setActiveSlide(i)}
            style={{ 
              width: i === activeSlide ? '24px' : '8px', 
              height: '8px', 
              background: 'white', 
              borderRadius: '4px', 
              opacity: i === activeSlide ? 1 : 0.4,
              cursor: 'pointer',
              transition: 'all 0.4s ease'
            }} 
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
