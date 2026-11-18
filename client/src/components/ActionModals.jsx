import React from 'react';
import { X, Mail } from 'lucide-react';

export const SendReminderModal = ({ isOpen, onClose, medicines }) => {
  if (!isOpen) return null;

  const handleEmail = () => {
    const username = localStorage.getItem('username') || 'Patient';
    const firstMed = medicines?.[0];
    const email = firstMed?.doctorEmail || '';
    const subject = encodeURIComponent(`Medical Check-in: ${username}`);
    const body = encodeURIComponent(`Hello,\n\nThis is a manual reminder regarding my medication schedule.\n\nPatient Name: ${username}\nMedicines: ${medicines?.map(m => m.name).join(', ') || 'N/A'}\n\nThank you!`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };
  
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '3rem', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', color: '#94a3b8' }}><X /></button>
        
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ width: '70px', height: '70px', background: '#fef2f2', color: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
            <Mail />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Manual Nudge</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Send a quick reminder to your doctor via Email.</p>
        </div>

        <div style={{ display: 'grid', gap: '1rem' }}>
          <button 
            onClick={handleEmail}
            style={{ background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', borderRadius: '1.25rem', width: '100%', fontWeight: 700, cursor: 'pointer' }}
          >
            <Mail /> Send Reminder via Email
          </button>
        </div>
      </div>
    </div>
  );
};
