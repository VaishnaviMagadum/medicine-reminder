import React from 'react';
import { X, Play, Clock, Zap } from 'lucide-react';
import healthAssistant from '../assets/health_assistant.png';

const ExerciseModal = ({ isOpen, onClose, exercise }) => {
  const [isWorkingOut, setIsWorkingOut] = React.useState(false);
  const [timer, setTimer] = React.useState(60);
  const [videoMode, setVideoMode] = React.useState(true);

  React.useEffect(() => {
    let interval;
    if (isWorkingOut && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else if (timer === 0) {
      setIsWorkingOut(false);
      alert('Workout Complete! Great job!');
      setTimer(60);
    }
    return () => clearInterval(interval);
  }, [isWorkingOut, timer]);

  if (!isOpen || !exercise) return null;

  const exerciseDetails = {
    'Morning Zen Yoga': {
      youtubeId: 'sTANio_2E0Q', 
      animation: 'animate-stretch',
      steps: ['Childs Pose', 'Cat-Cow', 'Sun Salutations', 'Savasana'],
      desc: 'A gentle 10-minute flow to wake up your body and mind.',
    },
    'Full Body Sculpt': {
      youtubeId: 'IFQmOZqvtWg', 
      animation: 'animate-strength',
      steps: ['Goblet Squats', 'Overhead Press', 'Glute Bridges', 'Plank Rows'],
      desc: 'Intermediate 45-minute sculpt session for total body toning.',
    },
    'Core Power HIIT': {
      youtubeId: 'ml6cT4AZdqI', 
      animation: 'animate-strength',
      steps: ['Bicycle Crunches', 'Burpees', 'Mountain Climbers', 'Plank Jacks'],
      desc: 'Advanced 30-minute HIIT session focusing on core and fat burn.',
    },
    'Pilates': {
      youtubeId: 'v7AYKMP6rOE', 
      animation: 'animate-walk',
      steps: ['The Hundred', 'Single Leg Stretch', 'Criss Cross', 'Scissors'],
      desc: 'Focus on control, breath, and core stability with this Pilates flow.',
    },
    'Stretching': {
      youtubeId: '2L2lnxIcNmo', 
      animation: 'animate-stretch',
      steps: ['Deep breathing', 'Neck Rolls', 'Forward Fold', 'Childs Pose'],
      desc: 'A calming 10-minute session to improve flexibility and reduce stress.',
    },
    'Cardio Blast': {
      youtubeId: 'ml6cT4AZdqI', 
      animation: 'animate-walk',
      steps: ['Jumping Jacks', 'High Knees', 'Mountain Climbers', 'Burpees'],
      desc: 'High-intensity interval training to boost your heart rate.',
    },
    'Yoga for Strength': {
      youtubeId: '9kOCY0KNByw', 
      animation: 'animate-stretch',
      steps: ['Warrior I', 'Warrior II', 'Triangle Pose', 'Plank'],
      desc: 'Build functional strength and balance through power yoga.',
    }
  };

  const detail = exerciseDetails[exercise.label] || {
    youtubeId: 'sTANio_2E0Q', 
    animation: 'animate-stretch',
    steps: ['Beginner Flow', 'Deep Breathing', 'Gentle Movement', 'Rest'],
    desc: 'A calming session to get you started with your wellness journey.',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(15, 23, 42, 0.98)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <style>
        {`
          @keyframes stretch-anim { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(1.1) translateY(-20px); } }
          @keyframes walk-anim { 0%, 100% { transform: rotate(-5deg) translateY(0); } 50% { transform: rotate(5deg) translateY(-15px); } }
          @keyframes strength-anim { 0%, 100% { transform: scale(1); } 50% { transform: scale(0.9) translateY(10px); } }
          .animate-stretch { animation: stretch-anim 2s ease-in-out infinite; }
          .animate-walk { animation: walk-anim 0.8s ease-in-out infinite; }
          .animate-strength { animation: strength-anim 1.5s ease-in-out infinite; }
          .animate-spin { animation: spin 1s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}
      </style>
      <div style={{ 
        background: 'var(--bg-card)', 
        maxWidth: '1100px', 
        width: '100%', 
        borderRadius: '3rem', 
        overflow: 'hidden', 
        boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.6)',
        border: '1px solid var(--border)',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr'
      }}>
        {/* Left Side: Dynamic Guide */}
        <div style={{ position: 'relative', background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)', height: '650px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {!videoMode ? (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <img 
                src={healthAssistant} 
                alt="Local Animated Coach" 
                className={isWorkingOut ? detail.animation : ''}
                style={{ width: '450px', height: 'auto', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.1))', transition: 'all 0.5s' }}
              />
              <div style={{ position: 'absolute', bottom: '2.5rem', background: 'rgba(255,255,255,0.8)', padding: '1rem 3rem', borderRadius: '2.5rem', fontWeight: 800, color: 'var(--primary)', boxShadow: 'var(--shadow)' }}>
                {isWorkingOut ? 'LOCAL ANIMATION: ACTIVE' : 'READY TO START'}
              </div>
            </div>
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#000', position: 'relative' }}>
              <iframe 
                key={detail.youtubeId}
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${detail.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${detail.youtubeId}&rel=0&modestbranding=1&enablejsapi=1`}
                title="Exercise Video" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
                style={{ border: 'none', position: 'relative', zIndex: 2 }}
              ></iframe>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexDirection: 'column', gap: '1rem', zIndex: 1 }}>
                <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
                <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>Loading Secure Stream...</p>
                <a href={`https://youtube.com/watch?v=${detail.youtubeId}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 800, textDecoration: 'none', marginTop: '1rem' }}>
                  Video not loading? Watch on YouTube ↗
                </a>
              </div>
            </div>
          )}

          {/* Mode Switcher */}
          <button 
            onClick={() => setVideoMode(!videoMode)}
            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10, background: 'var(--primary)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '1.25rem', fontSize: '0.8rem', fontWeight: 800, border: 'none', cursor: 'pointer', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.4)' }}
          >
            {videoMode ? 'Switch to Local Animation' : 'Try Video Mode'}
          </button>
          
          {isWorkingOut && (
            <div style={{ position: 'absolute', top: '2.5rem', left: '2.5rem', background: 'var(--primary)', color: 'white', padding: '1.2rem 2.5rem', borderRadius: '2rem', fontSize: '2.5rem', fontWeight: 900, boxShadow: '0 15px 30px rgba(99, 102, 241, 0.5)' }}>
              00:{timer < 10 ? `0${timer}` : timer}
            </div>
          )}
        </div>
        
        <div style={{ padding: '3rem', height: '600px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>{exercise.label}</h2>
              <span style={{ color: 'var(--primary)', fontWeight: 800 }}>STEP-BY-STEP GUIDE</span>
            </div>
            <button onClick={onClose} style={{ background: 'var(--bg-main)', color: 'var(--text-muted)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={24} />
            </button>
          </div>

          <p style={{ color: 'var(--text-muted)', fontWeight: 600, lineHeight: 1.6, marginBottom: '2rem' }}>{detail.desc}</p>

          <div style={{ marginBottom: '3rem' }}>
            {detail.steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
                <div style={{ width: '32px', height: '32px', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0 }}>
                  {i + 1}
                </div>
                <p style={{ fontWeight: 700, fontSize: '0.95rem', paddingTop: '4px' }}>{step}</p>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-main)' }}>Related Workouts</h3>
            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
              {['Morning Zen Yoga', 'Full Body Sculpt', 'Core Power HIIT', 'Pilates'].filter(name => name !== exercise.label).map(name => (
                <div 
                  key={name}
                  onClick={() => {
                    // This will trigger a re-render because exercise prop changes
                    onClose();
                    setTimeout(() => {
                      document.dispatchEvent(new CustomEvent('switchExercise', { detail: name }));
                    }, 100);
                  }}
                  style={{ 
                    flexShrink: 0, 
                    width: '140px', 
                    padding: '1rem', 
                    background: 'var(--bg-main)', 
                    borderRadius: '1.5rem', 
                    border: '1px solid var(--border)',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                    {name.includes('Yoga') ? '🧘' : name.includes('Sculpt') ? '💪' : name.includes('HIIT') ? '🔥' : '🤸'}
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, lineHeight: 1.2 }}>{name}</div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setIsWorkingOut(!isWorkingOut)}
            style={{ 
              width: '100%', 
              padding: '1.25rem', 
              background: isWorkingOut ? '#ef4444' : 'var(--primary)', 
              color: 'white', 
              borderRadius: '1.25rem', 
              fontWeight: 800, 
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)'
            }}
          >
            {isWorkingOut ? (
              <>Stop Session</>
            ) : (
              <><Play size={24} fill="white" /> Start "Do with Me" Session</>
            )}
          </button>
          {videoMode && (
             <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
               * Video is muted by default. Please click the volume icon on the player to unmute.
             </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseModal;
