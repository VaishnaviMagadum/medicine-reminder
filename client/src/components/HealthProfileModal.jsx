import React, { useState } from 'react';
import { X, Activity, Droplets, Zap, User, Ruler, Weight, Calendar } from 'lucide-react';

const HealthProfileModal = ({ isOpen, onClose, onUpdate }) => {
  const [data, setData] = useState({
    weight: 70,
    height: 170,
    age: 25,
    gender: 'male'
  });

  if (!isOpen) return null;

  const calculateMetrics = () => {
    const heightInMeters = data.height / 100;
    const bmi = (data.weight / (heightInMeters * heightInMeters)).toFixed(1);
    const water = (data.weight * 0.035).toFixed(1);
    const calories = data.gender === 'male' 
      ? (10 * data.weight + 6.25 * data.height - 5 * data.age + 5).toFixed(0)
      : (10 * data.weight + 6.25 * data.height - 5 * data.age - 161).toFixed(0);

    return { bmi, water, calories };
  };

  const metrics = calculateMetrics();

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ 
        background: 'white', 
        maxWidth: '850px', 
        width: '100%', 
        display: 'flex', 
        borderRadius: '2.5rem', 
        overflow: 'hidden', 
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)' 
      }}>
        
        {/* Left Stats Display */}
        <div style={{ 
          width: '320px', 
          background: 'linear-gradient(135deg, #0f172a, #1e293b)', 
          padding: '3rem', 
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '2rem'
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.2 }}>Calculated <br/><span style={{ color: 'var(--primary)' }}>Smart Goals</span></h2>
          
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                 <Droplets color="#0ea5e9" size={20} />
                 <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.6 }}>Water Intake</span>
               </div>
               <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{metrics.water}L <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>/ day</span></div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                 <Activity color="#10b981" size={20} />
                 <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.6 }}>Body Mass Index</span>
               </div>
               <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{metrics.bmi} <span style={{ fontSize: '0.8rem', color: '#10b981' }}>Healthy</span></div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                 <Zap color="#f59e0b" size={20} />
                 <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.6 }}>Calorie Goal</span>
               </div>
               <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{metrics.calories} <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>kcal</span></div>
            </div>
          </div>
        </div>

        {/* Right Form Input */}
        <div style={{ flex: 1, padding: '3.5rem', position: 'relative' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'none', color: '#94a3b8', fontSize: '1.5rem' }}>
            <X size={24} />
          </button>

          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Health Profile</h2>
            <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Update your body metrics for smart goals</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', marginBottom: '0.75rem' }}>Weight (kg)</label>
              <div style={{ position: 'relative' }}>
                <Weight size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                <input 
                  type="number" 
                  style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem', fontWeight: 700 }}
                  value={data.weight} 
                  onChange={e => setData({...data, weight: e.target.value})} 
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', marginBottom: '0.75rem' }}>Height (cm)</label>
              <div style={{ position: 'relative' }}>
                <Ruler size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                <input 
                  type="number" 
                  style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem', fontWeight: 700 }}
                  value={data.height} 
                  onChange={e => setData({...data, height: e.target.value})} 
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', marginBottom: '0.75rem' }}>Age (Years)</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                <input 
                  type="number" 
                  style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem', fontWeight: 700 }}
                  value={data.age} 
                  onChange={e => setData({...data, age: e.target.value})} 
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', marginBottom: '0.75rem' }}>Gender</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                <select 
                  style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem', fontWeight: 700, appearance: 'none' }}
                  value={data.gender} 
                  onChange={e => setData({...data, gender: e.target.value})}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
          </div>

          <button 
            onClick={() => { onUpdate(metrics); onClose(); }} 
            style={{ width: '100%', padding: '1.25rem', background: 'var(--primary)', color: 'white', borderRadius: '1.25rem', fontWeight: 800, fontSize: '1rem', boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)' }}
          >
            Update Health Goals
          </button>
        </div>
      </div>
    </div>
  );
};

export default HealthProfileModal;
