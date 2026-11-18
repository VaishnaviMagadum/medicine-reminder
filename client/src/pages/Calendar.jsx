import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Bell, Moon, Sun, Clock } from 'lucide-react';

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      clearInterval(timer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const days = [];
  const totalDays = daysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const offset = firstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  for (let i = 0; i < offset; i++) {
    days.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Simulated pill days (random for demo)
  const pillDays = [3, 8, 12, 14, 18, 22, 23, 27, 30];

  return (
    <div className="fade-in-page" style={{ paddingBottom: '5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem' }}>
        
        {/* Left Side: Calendar Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            background: 'linear-gradient(135deg, #2d1b4e 0%, #1a1033 100%)',
            borderRadius: '30px',
            padding: '2.5rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle Glow Effects */}
          <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'rgba(236, 72, 153, 0.1)', filter: 'blur(80px)', borderRadius: '50%' }}></div>
          <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '300px', height: '300px', background: 'rgba(59, 130, 246, 0.1)', filter: 'blur(80px)', borderRadius: '50%' }}></div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, opacity: 0.8, color: 'white' }}>Lady Pill Reminder</h2>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
              <button onClick={prevMonth} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%' }}><ChevronLeft /></button>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
              <button onClick={nextMonth} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%' }}><ChevronRight /></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1rem', textAlign: 'center', marginBottom: '1rem' }}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                <div key={d} style={{ fontWeight: 600, fontSize: '0.875rem', opacity: 0.5, color: 'white' }}>{d}</div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1rem' }}>
              {days.map((day, idx) => (
                <div key={idx} style={{ position: 'relative', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {day && (
                    <>
                      {/* Active Day Highlight */}
                      {selectedDate === day && (
                        <motion.div 
                          layoutId="selectedDay"
                          style={{ position: 'absolute', width: '45px', height: '45px', background: '#3b82f6', borderRadius: '50%', zIndex: 0 }}
                        />
                      )}
                      
                      {/* Pill Day Indicator */}
                      {pillDays.includes(day) && selectedDate !== day && (
                        <div style={{ position: 'absolute', width: '45px', height: '45px', background: 'rgba(236, 72, 153, 0.4)', borderRadius: '50%', zIndex: 0 }} />
                      )}

                      <span 
                        onClick={() => setSelectedDate(day)}
                        style={{ 
                          position: 'relative', 
                          zIndex: 1, 
                          fontWeight: 600, 
                          cursor: 'pointer',
                          fontSize: '1rem',
                          color: selectedDate === day ? 'white' : (pillDays.includes(day) ? 'white' : 'rgba(255,255,255,0.6)')
                        }}
                      >
                        {day}
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ opacity: 0.6, fontSize: '0.875rem', color: 'white' }}>Pill no. {selectedDate + 18}</p>
                  <p style={{ fontWeight: 700, fontSize: '1.125rem', color: 'white' }}>15 left in pack</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '45px', height: '45px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><Bell size={20} /></div>
                  <div style={{ width: '45px', height: '45px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><Moon size={20} /></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Visual & Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{ 
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              borderRadius: '30px',
              padding: '2rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center'
            }}
          >
            <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', height: '300px' }}>
              <img src="/src/assets/glowing_pill_bottle.png" alt="Pill Bottle" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            style={{ 
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '25px',
              padding: '1.5rem',
              border: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ec4899' }}></div>
              <p style={{ fontSize: '0.875rem', opacity: 0.8, color: 'white' }}>Taken regularly on pink marked days</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3b82f6' }}></div>
              <p style={{ fontSize: '0.875rem', opacity: 0.8, color: 'white' }}>Currently viewing this date</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
