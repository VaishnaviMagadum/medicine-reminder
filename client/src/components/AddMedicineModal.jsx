import React, { useState } from 'react';
import { X, Pill, Clock, Smartphone, Info, Calendar, Hash, Mail } from 'lucide-react';

const AddMedicineModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    reminderTime: '',
    mealType: 'after food',
    startDate: '',
    endDate: '',
    quantity: 30,
    totalQuantity: 30,
    doctorEmail: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: 'white', width: '100%', maxWidth: '800px', display: 'flex', borderRadius: '2.5rem', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)' }}>
        
        {/* Left Side: Branding/Info */}
        <div style={{ width: '300px', background: 'linear-gradient(135deg, #818cf8, #6366f1)', padding: '3rem', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.2)', borderRadius: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Pill size={32} />
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem' }}>New Schedule</h2>
            <p style={{ opacity: 0.8, fontSize: '0.95rem', lineHeight: 1.5 }}>Fill in the details to ensure you never miss a dose. Stay healthy!</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '1.5rem', display: 'flex', gap: '1rem' }}>
            <Info size={20} style={{ flexShrink: 0 }} />
            <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>Tip: Set reminders at least 15 minutes before your meal.</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div style={{ flex: 1, padding: '3rem', position: 'relative' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', color: '#94a3b8', padding: 0 }}>
            <X size={24} />
          </button>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', marginBottom: '0.5rem' }}>Medicine Name</label>
              <div style={{ position: 'relative' }}>
                <Pill size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#818cf8' }} />
                <input 
                  type="text" 
                  style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem', fontWeight: 700 }}
                  placeholder="e.g. Paracetamol"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', marginBottom: '0.5rem' }}>Recipient Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#818cf8' }} />
                <input 
                  type="email" 
                  style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem', fontWeight: 700 }}
                  placeholder="doctor@example.com"
                  value={formData.doctorEmail}
                  onChange={e => setFormData({...formData, doctorEmail: e.target.value})}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', marginBottom: '0.5rem' }}>Dosage</label>
                <div style={{ position: 'relative' }}>
                  <Hash size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#818cf8' }} />
                  <input 
                    type="text" 
                    style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem', fontWeight: 700 }}
                    placeholder="500mg"
                    required
                    value={formData.dosage}
                    onChange={e => setFormData({...formData, dosage: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', marginBottom: '0.5rem' }}>Time</label>
                <div style={{ position: 'relative' }}>
                  <Clock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#818cf8' }} />
                  <input 
                    type="time" 
                    style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem', fontWeight: 700 }}
                    required
                    value={formData.reminderTime}
                    onChange={e => setFormData({...formData, reminderTime: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', marginBottom: '0.5rem' }}>Stock Quantity</label>
                <input 
                  type="number" 
                  style={{ width: '100%', padding: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem', fontWeight: 700 }}
                  value={formData.totalQuantity}
                  onChange={e => setFormData({...formData, totalQuantity: e.target.value, quantity: e.target.value})}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', marginBottom: '0.5rem' }}>Meal Type</label>
                <select 
                  style={{ width: '100%', padding: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem', fontWeight: 700 }}
                  value={formData.mealType}
                  onChange={e => setFormData({...formData, mealType: e.target.value})}
                >
                  <option value="after food">After Food</option>
                  <option value="before food">Before Food</option>
                </select>
              </div>
            </div>

            <button type="submit" style={{ width: '100%', padding: '1.25rem', background: 'linear-gradient(135deg, #818cf8, #6366f1)', color: 'white', border: 'none', borderRadius: '1.25rem', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(129, 140, 248, 0.3)' }}>
              Schedule Medication
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMedicineModal;
