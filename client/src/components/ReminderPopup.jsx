import React, { useEffect, useRef, useState } from 'react';
import { Bell, Check, X, Mail, Loader2, Send } from 'lucide-react';

const ReminderPopup = ({ medicine, onAction, onClose }) => {
  const audioRef = useRef(null);
  const [autoStatus, setAutoStatus] = useState('sending'); // sending, sent
  const [alertCount, setAlertCount] = useState(0);
  const triggerAlert = (count) => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.warn('Audio play failed', e));
    }
    
    // Send browser notification
    if (Notification.permission === 'granted') {
      new Notification(`Reminder (Alert ${count + 1}/3): ${medicine.name}`, {
        body: `It's time for your ${medicine.dosage}. Please take it now.`,
        icon: '/vite.svg'
      });
    }
    
    setAlertCount(count + 1);
  };

  useEffect(() => {
    if (medicine) {
      let currentCount = 0;
      
      // First alert immediately
      triggerAlert(currentCount);
      currentCount++;
      
      // Exhibition special: Simulate automatic sending
      const autoTimer = setTimeout(() => {
        setAutoStatus('sent');
      }, 3000);
      
      // Periodic alerts (every 5 minutes, up to 3 times total)
      const alertInterval = setInterval(() => {
        if (currentCount < 3) {
          triggerAlert(currentCount);
          currentCount++;
        } else {
          clearInterval(alertInterval);
        }
      }, 5 * 60 * 1000); // 5 minutes
      
      return () => {
        clearTimeout(autoTimer);
        clearInterval(alertInterval);
      };
    }
  }, [medicine]);

  if (!medicine) return null;

  const handleEmail = () => {
    const subject = encodeURIComponent(`Medical Alert: Time for ${medicine.name}`);
    const body = encodeURIComponent(`Hello,\n\nThis is a reminder from MedReminder to take your ${medicine.name} (${medicine.dosage}) at ${medicine.reminderTime}.\n\nStay healthy!`);
    window.location.href = `mailto:${medicine.doctorEmail || ''}?subject=${subject}&body=${body}`;
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <audio ref={audioRef} src="/assets/medicine_reminder.mp3" preload="auto"></audio>
      
      <div style={{ background: 'white', width: '100%', maxWidth: '450px', borderRadius: '2.5rem', padding: '3rem', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)' }}>
        
        {/* NEW: Auto-Send Status Indicator */}
        <div style={{ 
          background: autoStatus === 'sending' ? '#f0f9ff' : '#f0fdf4', 
          padding: '0.75rem', 
          borderRadius: '1rem', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '0.75rem', 
          marginBottom: '2rem',
          border: `1px solid ${autoStatus === 'sending' ? '#bae6fd' : '#bbf7d0'}`
        }}>
           {autoStatus === 'sending' ? (
             <>
               <Loader2 size={16} className="animate-spin" color="#0ea5e9" />
               <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0369a1' }}>Sending automatic alert...</span>
             </>
           ) : (
             <>
               <Send size={16} color="#15803d" />
               <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#15803d' }}>Background alert sent to Dr. Sharma!</span>
             </>
           )}
        </div>

        <div style={{ width: '80px', height: '80px', background: '#2563eb', borderRadius: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', margin: '0 auto 2rem auto', animation: 'bounce 1s infinite' }}>
          <Bell size={40} />
        </div>
        
        <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>Medicine Reminder</p>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#1e293b', marginBottom: '0.5rem' }}>{medicine.name}</h1>
        <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#64748b', marginBottom: '2.5rem' }}>{medicine.dosage} • {medicine.mealType}</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <button onClick={() => onAction('taken')} className="submit-btn">
            <Check size={18} /> Taken
          </button>
          <button onClick={handleEmail} className="submit-btn" style={{ background: '#faf5ff', color: '#a855f7', boxShadow: 'none' }}>
            <Mail size={18} /> Email
          </button>
        </div>
        
        <button onClick={onClose} className="submit-btn" style={{ marginTop: '1.5rem', background: '#f1f5f9', color: '#64748b', boxShadow: 'none' }}>Dismiss</button>
      </div>
    </div>

  );
};

export default ReminderPopup;
