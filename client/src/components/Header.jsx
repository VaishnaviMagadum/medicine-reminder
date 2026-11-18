import React, { useState, useEffect } from 'react';
import { LogOut, User, Activity, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Header = ({ username, onLogout }) => {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header style={{ background: 'white', borderBottom: '1px solid #f1f5f9', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, textDecoration: 'none' }}>
          <div style={{ width: '40px', height: '40px', background: '#3b82f6', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800 }}>M</div>
          <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#1e293b' }}>MedReminder</span>
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/calendar" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }}>
            <CalendarIcon size={18} />
            View Calendar
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
            <Activity size={18} />
            Health Profile
          </div>
          <div style={{ background: '#f8fafc', padding: '0.4rem 1rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: '#475569', fontSize: '0.85rem' }}>
            <Clock size={16} color="#3b82f6" />
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '1px solid #e2e8f0', paddingLeft: '1.5rem' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Good Day,</p>
              <p style={{ fontSize: '0.875rem', fontWeight: 800, color: '#1e293b' }}>{username || 'User'}</p>
            </div>
            <button onClick={onLogout} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><LogOut size={20} /></button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
