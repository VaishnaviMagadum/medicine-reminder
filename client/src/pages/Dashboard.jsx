import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, Package, FileText, User as UserIcon, LogOut, 
  Search, Bell, Plus, ChevronRight, Calendar as CalendarIcon, 
  Droplets, Activity, Zap, Clock, AlertCircle, FileDown, Menu, X,
  Sun, Moon, Trash2, Pill, Dumbbell, Brain, Heart, Bot, Target, Play
} from 'lucide-react';
import Carousel from '../components/Carousel';
import AddMedicineModal from '../components/AddMedicineModal';
import HealthProfileModal from '../components/HealthProfileModal';
import ReminderPopup from '../components/ReminderPopup';
import { SendReminderModal } from '../components/ActionModals';
import ExerciseModal from '../components/ExerciseModal';
import { medicineService } from '../services/api';
import useReminders from '../hooks/useReminders';
import glowingPillBottle from '../assets/glowing_pill_bottle.png';
import healthAssistant from '../assets/health_assistant.png';
import wellnessBg from '../assets/wellness_bg.png';
import fitnessIcon from '../assets/fitness_icon.png';
import meditationIcon from '../assets/meditation.png';
import medicalHero from '../assets/medical_hero.png';
import appHero from '../assets/app_hero.png';
import videoBg from '../assets/video_bg.png';


const Dashboard = ({ theme, setTheme }) => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAllMedicines, setShowAllMedicines] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState('Home');
  const [showNotifications, setShowNotifications] = useState(false);
  const [healthData, setHealthData] = useState(() => {
    const saved = localStorage.getItem('healthData');
    return saved ? JSON.parse(saved) : { bmi: '22.9', water: '2.5', calories: '1791' };
  });
  const [assistantMsg, setAssistantMsg] = useState("Hello! I'm your AI Med-Bot. How can I help you today?");
  const [chatInput, setChatInput] = useState('');
  const chatInputRef = React.useRef(null);
  
  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    const userQuery = chatInput.toLowerCase();
    setAssistantMsg("Typing...");
    
    setTimeout(() => {
      if (userQuery.includes('hello') || userQuery.includes('hi')) {
        setAssistantMsg("Hello! How can I assist you with your health or medications today?");
      } else if (userQuery.includes('water') || userQuery.includes('drink') || userQuery.includes('hydration')) {
        setAssistantMsg("It's generally recommended to drink 2-3 liters of water daily, depending on your activity level. Stay hydrated!");
      } else if (userQuery.includes('medication') || userQuery.includes('pill')) {
        setAssistantMsg("Always take your medications at the same time every day. Would you like me to check your current schedule?");
      } else if (userQuery.includes('exercise') || userQuery.includes('workout') || userQuery.includes('fitness')) {
        setAssistantMsg("Exercise is great for heart health! I recommend starting with 'Morning Zen Yoga' for flexibility.");
      } else if (userQuery.includes('sleep') || userQuery.includes('tired')) {
        setAssistantMsg("Good sleep hygiene is crucial. Try to avoid screens 1 hour before bed for better recovery.");
      } else if (userQuery.includes('safety') || userQuery.includes('safe')) {
        setAssistantMsg("Medication safety is our priority. Keep meds in a cool, dry place, out of reach of children, and never share your prescription.");
      } else if (userQuery.includes('side effect') || userQuery.includes('dizzy') || userQuery.includes('nausea')) {
        setAssistantMsg("Common side effects can include mild dizziness or nausea. If they persist or feel severe, please contact your pharmacist or doctor.");
      } else if (userQuery.includes('dosage') || userQuery.includes('how much')) {
        setAssistantMsg("Always follow the exact dosage prescribed on your bottle. Over-dosing or under-dosing can be dangerous.");
      } else if (userQuery.includes('mental') || userQuery.includes('stress') || userQuery.includes('anxiety')) {
        setAssistantMsg("Mental health is just as important as physical health. Take breaks, practice deep breathing, and reach out for professional support if you're feeling overwhelmed.");
      } else if (userQuery.includes('meal') || userQuery.includes('when to take')) {
        const medsWithMeal = medicines.filter(m => m.mealType);
        if (medsWithMeal.length > 0) {
          const uniqueMeds = [...new Set(medsWithMeal.map(m => `${m.name} (${m.mealType})`))];
          setAssistantMsg(`Your medication plan requires: ${uniqueMeds.join(', ')}. Proper timing ensures the best results.`);
        } else {
          setAssistantMsg("I don't see any specific meal requirements for your current medicines. Generally, taking them after a light meal is a safe practice.");
        }
      } else if (userQuery.includes('eat') || userQuery.includes('food') || userQuery.includes('diet') || userQuery.includes('nutrition')) {
        setAssistantMsg("For optimal health, focus on high-fiber vegetables, lean proteins (like chicken, fish, or beans), and whole grains. Avoid excess sugar and stay hydrated!");
      } else if (userQuery.includes('pain') || userQuery.includes('hurt')) {
        setAssistantMsg("If you're experiencing severe pain, please rest and consult a healthcare professional immediately.");
      } else {
        setAssistantMsg("That's interesting! I'm constantly learning about wellness. Is there anything specific about your schedule or health you'd like to discuss?");
      }
    }, 1000);
    setChatInput('');
  };

  const { activeReminder, setActiveReminder } = useReminders(medicines);



  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const notifications = medicines
    .filter(m => m.quantity <= 5)
    .map(m => ({ id: m.id, text: `Low stock: ${m.name} (${m.quantity} left)`, type: 'alert' }));

  useEffect(() => {
    fetchMedicines();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchMedicines = async () => {
    try {
      const res = await medicineService.getAll();
      setMedicines(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Automated Low Stock Notification on Login/Refresh
  useEffect(() => {
    if (medicines.length > 0) {
      const lowStockMeds = medicines.filter(m => m.quantity <= 5 && m.quantity > 0);
      if (lowStockMeds.length > 0 && Notification.permission === 'granted') {
        new Notification("Stock Reminder", {
          body: `You have ${lowStockMeds.length} medicine(s) running low on stock.`,
          icon: '/vite.svg'
        });
      }
    }
  }, [medicines.length > 0]);

  const handleTakeMedicine = async (med) => {
    try {
      const newQuantity = Math.max(0, med.quantity - 1);
      await medicineService.update(med.id, { quantity: newQuantity });
      
      if (newQuantity <= 5 && newQuantity > 0) {
        if (Notification.permission === 'granted') {
          new Notification("Low Stock Alert!", {
            body: `Your stock for ${med.name} is low (${newQuantity} left). Please refill soon!`,
            icon: '/vite.svg'
          });
        }
      }
      
      setActiveReminder(null);
      fetchMedicines();
    } catch (err) {
      console.error('Failed to update stock:', err);
    }
  };

  useEffect(() => {
    const handleSwitch = (e) => {
      const label = e.detail;
      const icons = { 'Morning Zen Yoga': '🧘', 'Full Body Sculpt': '💪', 'Core Power HIIT': '🔥', 'Pilates': '🤸', 'Stretching': '✨', 'Yoga for Strength': '⚡' };
      setSelectedExercise({ label, icon: icons[label] || '🧘' });
    };
    document.addEventListener('switchExercise', handleSwitch);
    return () => document.removeEventListener('switchExercise', handleSwitch);
  }, []);

  const handleRefill = async (id, currentQuantity) => {
    try {
      await medicineService.update(id, { quantity: currentQuantity + 30 });
      fetchMedicines();
    } catch (err) {
      console.error('Failed to refill:', err);
    }
  };

  const handleDeleteMedicine = async (id) => {
    if (window.confirm("Are you sure you want to delete this medication?")) {
      try {
        await medicineService.delete(id);
        fetchMedicines();
      } catch (err) {
        console.error('Failed to delete medicine:', err);
        alert("Failed to delete medicine. Please try again.");
      }
    }
  };

  const handleDownloadReport = () => {
    if (medicines.length === 0) {
      alert("No medication data available to generate a report.");
      return;
    }
    const username = localStorage.getItem('username') || 'Patient';
    const reportDate = new Date().toLocaleString();
    let reportContent = `==========================================\n       MEDREMINDER PATIENT REPORT\n==========================================\n\nPatient Name: ${username}\nGenerated On: ${reportDate}\n------------------------------------------\n\nCURRENT MEDICATION SCHEDULE:\n\n`;
    medicines.forEach((m, i) => {
      reportContent += `${i + 1}. ${m.name.toUpperCase()}\n   Dosage: ${m.dosage}\n   Reminder Time: ${m.reminderTime}\n   Stock Remaining: ${m.quantity} pills\n   Meal Type: ${m.mealType}\n------------------------------------------\n`;
    });
    const element = document.createElement("a");
    const file = new Blob([reportContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `MedReminder_Report_${username.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.dosage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderContent = () => {
    switch(currentView) {
      case 'Inventory':
        return (
          <div className="fade-in-page" style={{ paddingBottom: '5rem' }}>
            {/* Cinematic Hero Section */}
            <div style={{ 
              position: 'relative', 
              height: '350px', 
              borderRadius: '4rem', 
              overflow: 'hidden', 
              marginBottom: '4rem', 
              boxShadow: '0 40px 80px -15px rgba(16, 185, 129, 0.2)',
              background: 'linear-gradient(135deg, #064e3b, #065f46)'
            }}>
               <img src="/src/assets/inventory_banner_premium_1778145266573.png" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3, mixBlendMode: 'overlay' }} alt="" />
               <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(6, 78, 59, 0.9) 30%, transparent)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '5rem' }}>
                 <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <span style={{ background: '#10b981', color: 'white', padding: '0.6rem 1.5rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '2px' }}>● LIVE STOCK</span>
                    <span style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.5rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 800, backdropFilter: 'blur(10px)' }}>REAL-TIME TRACKING</span>
                 </div>
                 <h1 style={{ color: 'white', fontSize: '4.5rem', fontWeight: 900, lineHeight: 1, marginBottom: '1.5rem', letterSpacing: '-2px' }}>
                   Medicine <br/> 
                   <span style={{ 
                     background: 'linear-gradient(to right, #34d399, #6ee7b7)', 
                     WebkitBackgroundClip: 'text', 
                     WebkitTextFillColor: 'transparent',
                     display: 'inline-block' 
                   }}>
                     Stock Center.
                   </span>
                 </h1>
                 <p style={{ color: 'white', opacity: 0.7, fontSize: '1.1rem', fontWeight: 600, maxWidth: '500px', marginBottom: '2.5rem' }}>Easily monitor, manage, and refill your medication supply with our smart inventory system.</p>
                 <button onClick={() => setIsModalOpen(true)} style={{ width: 'fit-content', padding: '1.2rem 3rem', background: 'white', color: '#064e3b', borderRadius: '1.5rem', fontWeight: 900, fontSize: '1rem', border: 'none', cursor: 'pointer', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <Plus size={22} /> ADD NEW MEDICINE
                 </button>
               </div>
            </div>

            {/* Stock Summary Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem', marginBottom: '4rem' }}>
               {[
                 { label: 'TOTAL PILLS', value: medicines.reduce((acc, m) => acc + m.quantity, 0), icon: <Package />, color: '#10b981' },
                 { label: 'CRITICAL STOCK', value: medicines.filter(m => m.quantity <= 5).length, icon: <AlertCircle />, color: '#ef4444' },
                 { label: 'ACTIVE PLANS', value: medicines.length, icon: <Activity />, color: '#6366f1' }
               ].map((stat, i) => (
                 <div key={i} className="card hover-lift" style={{ padding: '2.5rem', borderRadius: '3rem', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '2rem' }}>
                   <div style={{ width: '70px', height: '70px', background: `${stat.color}15`, color: stat.color, borderRadius: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {React.cloneElement(stat.icon, { size: 30 })}
                   </div>
                   <div>
                     <div style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '0.25rem' }}>{stat.label}</div>
                     <div style={{ fontSize: '2.2rem', fontWeight: 900 }}>{stat.value}</div>
                   </div>
                 </div>
               ))}
            </div>

            {/* Beautiful Medicine Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
              {filteredMedicines.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)', gridColumn: '1/-1', background: 'var(--bg-card)', borderRadius: '3rem', border: '1px dashed var(--border)' }}>
                   <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
                   <h3 style={{ fontWeight: 800 }}>No Medicines Found</h3>
                   <p>Your inventory is currently empty or no matches found.</p>
                </div>
              ) : (
                filteredMedicines.map(m => (
                  <div key={m.id} className="card hover-lift" style={{ 
                    padding: '2.5rem', 
                    background: 'var(--bg-card)', 
                    borderRadius: '3.5rem', 
                    border: '1px solid var(--border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                       <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                          <div style={{ width: '65px', height: '65px', background: 'var(--bg-main)', borderRadius: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>💊</div>
                          <div>
                             <h3 style={{ fontWeight: 900, fontSize: '1.4rem' }}>{m.name}</h3>
                             <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>{m.dosage} • {m.mealType || 'General'}</div>
                          </div>
                       </div>
                       <Trash2 
                         size={22} 
                         color="#ef4444" 
                         style={{ cursor: 'pointer', opacity: 0.5 }} 
                         onClick={(e) => { e.stopPropagation(); handleDeleteMedicine(m.id); }} 
                       />
                    </div>

                    <div>
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'baseline' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-muted)' }}>STOCK LEVEL</span>
                          <span style={{ fontSize: '1.2rem', fontWeight: 900, color: m.quantity <= 5 ? '#ef4444' : 'var(--text-main)' }}>{m.quantity} <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>pills left</span></span>
                       </div>
                       <div style={{ width: '100%', height: '12px', background: 'var(--bg-main)', borderRadius: '6px', overflow: 'hidden' }}>
                          <div style={{ 
                            width: `${Math.min(100, (m.quantity / (m.totalQuantity || 30)) * 100)}%`, 
                            height: '100%', 
                            background: m.quantity <= 5 ? 'linear-gradient(to right, #ef4444, #f87171)' : 'linear-gradient(to right, #10b981, #34d399)',
                            transition: 'width 1s ease-in-out'
                          }}></div>
                       </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                       <button 
                         onClick={() => handleRefill(m.id, m.quantity)}
                         style={{ flex: 1, padding: '1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '1.5rem', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                       >
                         <Plus size={18} /> QUICK REFILL (+30)
                       </button>
                       <button 
                         onClick={() => navigate('/calendar')}
                         style={{ padding: '1rem 1.5rem', background: 'var(--bg-main)', color: 'var(--text-main)', border: '1px solid var(--border)', borderRadius: '1.5rem', fontWeight: 800, cursor: 'pointer' }}
                       >
                         <CalendarIcon size={18} />
                       </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      case 'Reports':
        return (
          <div className="fade-in-page" style={{ paddingBottom: '5rem' }}>
            {/* Cinematic Hero Section */}
            <div style={{ 
              position: 'relative', 
              height: '350px', 
              borderRadius: '4rem', 
              overflow: 'hidden', 
              marginBottom: '4rem', 
              boxShadow: '0 40px 80px -15px rgba(99, 102, 241, 0.2)',
              background: 'linear-gradient(135deg, #1e293b, #0f172a)'
            }}>
               <img src="/src/assets/reports_banner_sophisticated_1778145284510.png" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3, mixBlendMode: 'overlay' }} alt="" />
               <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(15, 23, 42, 0.9) 30%, transparent)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '5rem' }}>
                 <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <span style={{ background: '#6366f1', color: 'white', padding: '0.6rem 1.5rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '2px' }}>● ANALYTICS READY</span>
                    <span style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.5rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 800, backdropFilter: 'blur(10px)' }}>VERIFIED DATA</span>
                 </div>
                 <h1 style={{ color: 'white', fontSize: '4rem', fontWeight: 900, lineHeight: 1, marginBottom: '1.5rem', letterSpacing: '-2px' }}>
                   Medical <br/> 
                   <span style={{ 
                     background: 'linear-gradient(to right, #818cf8, #c084fc)', 
                     WebkitBackgroundClip: 'text', 
                     WebkitTextFillColor: 'transparent',
                     display: 'inline-block' 
                   }}>
                     Health Analytics.
                   </span>
                 </h1>
                 <p style={{ color: 'white', opacity: 0.7, fontSize: '1.1rem', fontWeight: 600, maxWidth: '500px', marginBottom: '2.5rem' }}>Comprehensive tracking of your medication adherence and health milestones.</p>
                 <button onClick={handleDownloadReport} style={{ width: 'fit-content', padding: '1.2rem 3rem', background: 'white', color: '#1e293b', borderRadius: '1.5rem', fontWeight: 900, fontSize: '1rem', border: 'none', cursor: 'pointer', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <FileDown size={22} /> DOWNLOAD FULL REPORT
                 </button>
               </div>
            </div>

            {/* Summary Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem', marginBottom: '4rem' }}>
               {[
                 { label: 'ACTIVE MEDS', value: medicines.length, icon: <Activity />, color: '#6366f1' },
                 { label: 'ADHERENCE RATE', value: '98%', icon: <Zap />, color: '#10b981' },
                 { label: 'LOW STOCK ITEMS', value: medicines.filter(m => m.quantity <= 5).length, icon: <AlertCircle />, color: '#f59e0b' }
               ].map((stat, i) => (
                 <div key={i} className="card hover-lift" style={{ padding: '2.5rem', borderRadius: '3rem', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '2rem' }}>
                   <div style={{ width: '70px', height: '70px', background: `${stat.color}15`, color: stat.color, borderRadius: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {React.cloneElement(stat.icon, { size: 30 })}
                   </div>
                   <div>
                     <div style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '0.25rem' }}>{stat.label}</div>
                     <div style={{ fontSize: '2.2rem', fontWeight: 900 }}>{stat.value}</div>
                   </div>
                 </div>
               ))}
            </div>

            {/* Detailed Records Table */}
            <div className="card" style={{ padding: '3.5rem', borderRadius: '4rem', background: 'var(--bg-card)', border: '1px solid var(--border)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 900 }}>Detailed Medication Log</h2>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 700 }}>Total Records: {medicines.length}</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                      <th style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>Medicine</th>
                      <th style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>Dosage</th>
                      <th style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>Schedule</th>
                      <th style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicines.map(m => (
                      <tr key={m.id} style={{ borderBottom: '1px solid var(--border)' }} className="hover-row">
                        <td style={{ padding: '1.5rem' }}>
                           <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>{m.name}</div>
                           <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{m.mealType || 'General'}</div>
                        </td>
                        <td style={{ padding: '1.5rem', fontWeight: 700, color: 'var(--text-muted)' }}>{m.dosage}</td>
                        <td style={{ padding: '1.5rem' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800, color: 'var(--primary)' }}>
                              <Clock size={16} /> {m.reminderTime}
                           </div>
                        </td>
                        <td style={{ padding: '1.5rem' }}>
                           <span style={{ 
                             padding: '0.6rem 1.25rem', 
                             borderRadius: '2rem', 
                             fontSize: '0.7rem', 
                             fontWeight: 900, 
                             background: m.quantity <= 5 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                             color: m.quantity <= 5 ? '#ef4444' : '#10b981',
                             border: `1px solid ${m.quantity <= 5 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`,
                             display: 'inline-flex',
                             alignItems: 'center',
                             gap: '0.5rem',
                             letterSpacing: '0.5px'
                           }}>
                             <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></span>
                             {m.quantity <= 5 ? 'LOW STOCK' : 'HEALTHY'}
                           </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'Overview':
        return (
          <div className="fade-in-page">
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Project Overview</h1>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div className="card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Zap size={20} /> Key Features
                </h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <li style={{ fontWeight: 600, display: 'flex', gap: '0.75rem' }}>✨ <span><b>Smart Reminders</b>: Sound & Voice alerts</span></li>
                  <li style={{ fontWeight: 600, display: 'flex', gap: '0.75rem' }}>📊 <span><b>Health Dashboard</b>: BMI & Calorie logic</span></li>
                  <li style={{ fontWeight: 600, display: 'flex', gap: '0.75rem' }}>🔔 <span><b>Refill Alerts</b>: Automated stock tracking</span></li>
                  <li style={{ fontWeight: 600, display: 'flex', gap: '0.75rem' }}>📄 <span><b>Report Generator</b>: Export medical schedules</span></li>
                </ul>
              </div>
              <div className="card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Activity size={20} /> Tech Stack
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {['React.js', 'Node.js', 'Express', 'SQLite', 'Tailwind CSS', 'Framer Motion'].map(tech => (
                    <span key={tech} style={{ padding: '0.5rem 1rem', background: 'var(--bg-main)', borderRadius: '0.75rem', fontSize: '0.85rem', fontWeight: 700, border: '1px solid var(--border)' }}>
                      {tech}
                    </span>
                  ))}
                </div>
                <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Built for high-performance and zero-setup local privacy.
                </p>
              </div>
            </div>
          </div>
        );
      case 'Exercise':
        return (
          <div className="fade-in-page" style={{ color: 'var(--text-main)', paddingBottom: '5rem' }}>
            {/* Cinematic Hero Section */}
            <div style={{ 
              position: 'relative', 
              height: '450px', 
              borderRadius: '4rem', 
              overflow: 'hidden', 
              marginBottom: '3rem', 
              boxShadow: '0 40px 80px -15px rgba(99, 102, 241, 0.3)',
              background: 'linear-gradient(135deg, #0f172a, #1e1b4b)'
            }}>
               <img src={wellnessBg} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4, mixBlendMode: 'overlay' }} alt="" />
               <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(15, 23, 42, 0.95) 20%, transparent)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '5rem' }}>
                 <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
                    <button 
                      onClick={() => setSelectedExercise({ label: 'Core Power HIIT', icon: '🔥' })}
                      style={{ border: 'none', background: '#ef4444', color: 'white', padding: '0.6rem 1.5rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '2px', boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)', cursor: 'pointer' }}
                    >
                      ● LIVE SESSION
                    </button>
                    <span style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.5rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 800, backdropFilter: 'blur(10px)' }}>4.8 ⭐ (1.2k Reviews)</span>
                 </div>
                 <h1 style={{ color: 'white', fontSize: '4.5rem', fontWeight: 900, lineHeight: 1, marginBottom: '1.5rem', letterSpacing: '-2px' }}>Transform Your <br/> <span style={{ background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Potential.</span></h1>
                 <p style={{ color: 'white', opacity: 0.7, fontSize: '1.2rem', fontWeight: 600, maxWidth: '600px', marginBottom: '3rem', lineHeight: 1.6 }}>Join thousands of users in our AI-driven fitness revolution. Track every move, burn more calories, and feel the difference.</p>
                 <div style={{ display: 'flex', gap: '2rem' }}>
                    <button onClick={() => setSelectedExercise({ label: 'Full Body Sculpt', icon: '💪' })} style={{ padding: '1.5rem 3.5rem', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', borderRadius: '2rem', fontWeight: 900, fontSize: '1.1rem', border: 'none', cursor: 'pointer', boxShadow: '0 20px 40px rgba(99, 102, 241, 0.4)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <Play size={24} fill="white" /> START JOURNEY
                    </button>
                    <button 
                      onClick={() => navigate('/calendar')}
                      style={{ padding: '1.5rem 3.5rem', background: 'rgba(255,255,255,0.05)', color: 'white', borderRadius: '2rem', fontWeight: 900, fontSize: '1.1rem', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', backdropFilter: 'blur(10px)' }}
                    >
                      VIEW SCHEDULE
                    </button>
                 </div>
               </div>
            </div>

            {/* Vibrant Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2.5rem', marginBottom: '5rem' }}>
              {[
                { label: 'CALORIES', value: '2,450', unit: 'kcal', icon: <Zap />, color: '#f59e0b', sub: '+12% from yesterday' },
                { label: 'DURATION', value: '185', unit: 'min', icon: <Clock />, color: '#10b981', sub: 'Goal: 200 min' },
                { label: 'HEART RATE', value: '118', unit: 'bpm', icon: <Activity />, color: '#ef4444', sub: 'Healthy Range' },
                { label: 'EFFICIENCY', value: '94', unit: '%', icon: <Zap />, color: '#6366f1', sub: 'Peak Performance' }
              ].map((stat, i) => (
                <div key={i} className="card hover-lift" style={{ 
                  background: 'var(--bg-card)', 
                  padding: '2.5rem', 
                  borderRadius: '3rem', 
                  border: '1px solid var(--border)',
                  boxShadow: '0 20px 50px -15px rgba(0,0,0,0.05)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: `${stat.color}10`, borderRadius: '0 0 0 100%' }}></div>
                  <div style={{ color: stat.color, marginBottom: '2rem' }}>{stat.icon}</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '0.5rem' }}>{stat.label}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 900 }}>{stat.value}</span>
                    <span style={{ fontSize: '1rem', fontWeight: 800, opacity: 0.4 }}>{stat.unit}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: stat.color }}>{stat.sub}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '4rem', marginBottom: '4rem' }}>
              {/* colorful Category Grid */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                   <h2 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-1px' }}>Training Categories</h2>
                   <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--border)', cursor: 'pointer' }}>←</button>
                      <button style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', border: 'none', color: 'white', cursor: 'pointer' }}>→</button>
                   </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  {[
                    { name: 'Morning Zen Yoga', level: 'Beginner', icon: '🧘', color: '#8b5cf6', bg: 'linear-gradient(135deg, #f5f3ff, #ede9fe)' },
                    { name: 'Full Body Sculpt', level: 'Intermediate', icon: '💪', color: '#10b981', bg: 'linear-gradient(135deg, #f0fdf4, #dcfce7)' },
                    { name: 'Core Power HIIT', level: 'Advanced', icon: '🔥', color: '#f59e0b', bg: 'linear-gradient(135deg, #fffbeb, #fef3c7)' },
                    { name: 'Pilates', level: 'Intermediate', icon: '🤸', color: '#3b82f6', bg: 'linear-gradient(135deg, #eff6ff, #dbeafe)' },
                    { name: 'Stretching', level: 'Beginner', icon: '✨', color: '#ec4899', bg: 'linear-gradient(135deg, #fdf2f8, #fce7f3)' },
                    { name: 'Yoga for Strength', level: 'Advanced', icon: '⚡', color: '#6366f1', bg: 'linear-gradient(135deg, #f5f3ff, #ede9fe)' }
                  ].map(item => (
                    <div 
                      key={item.name} 
                      onClick={() => setSelectedExercise({ label: item.name, icon: item.icon })}
                      style={{ 
                        padding: '2.5rem', 
                        background: 'var(--bg-card)', 
                        borderRadius: '3.5rem', 
                        border: '1px solid var(--border)',
                        cursor: 'pointer',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        display: 'flex',
                        gap: '2rem',
                        alignItems: 'center'
                      }}
                      className="category-card-premium"
                    >
                      <div style={{ 
                        width: '90px', 
                        height: '90px', 
                        background: item.bg, 
                        borderRadius: '2.5rem', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '3rem',
                        boxShadow: `0 15px 30px ${item.color}20`
                      }}>{item.icon}</div>
                      <div>
                        <h3 style={{ fontWeight: 900, fontSize: '1.4rem', marginBottom: '0.25rem' }}>{item.name}</h3>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                           <span style={{ fontSize: '0.8rem', fontWeight: 800, color: item.color }}>{item.level}</span>
                           <span style={{ width: '4px', height: '4px', background: 'var(--border)', borderRadius: '50%' }}></span>
                           <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Start Now</span>
                        </div>
                      </div>
                      <div style={{ marginLeft: 'auto', opacity: 0.3 }}><ChevronRight /></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advanced Performance Sidebar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                 <div>
                   <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '2.5rem' }}>Weekly Goals</h2>
                   <div className="card" style={{ padding: '3.5rem', background: 'linear-gradient(135deg, #4f46e5, #6366f1)', borderRadius: '4rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
                      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                         <div style={{ fontSize: '0.9rem', fontWeight: 800, opacity: 0.8, marginBottom: '1rem', letterSpacing: '2px' }}>OVERALL PROGRESS</div>
                         <div style={{ fontSize: '5rem', fontWeight: 900, lineHeight: 1 }}>82<span style={{ fontSize: '2rem', opacity: 0.6 }}>%</span></div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                         {[60, 85, 45, 90, 70, 20, 10].map((h, i) => (
                           <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', flex: 1 }}>
                              <div style={{ width: '100%', height: '120px', background: 'rgba(255,255,255,0.1)', borderRadius: '1rem', position: 'relative', overflow: 'hidden' }}>
                                 <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${h}%`, background: 'white', borderRadius: '1rem' }}></div>
                              </div>
                              <span style={{ fontSize: '0.7rem', fontWeight: 900, opacity: 0.6 }}>{['M','T','W','T','F','S','S'][i]}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                 </div>

                 <div className="card" style={{ padding: '2.5rem', borderRadius: '3.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '2rem' }}>
                       <div style={{ width: '60px', height: '60px', background: '#fef2f2', color: '#ef4444', borderRadius: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Activity /></div>
                       <div>
                          <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>Active Calories</div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>850 / 1200 kcal</div>
                       </div>
                    </div>
                    <div style={{ width: '100%', height: '12px', background: 'var(--bg-main)', borderRadius: '6px', overflow: 'hidden' }}>
                       <div style={{ width: '70%', height: '100%', background: 'linear-gradient(to right, #ef4444, #f87171)', borderRadius: '6px' }}></div>
                    </div>
                 </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Browse Library</h3>
              <button style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.9rem', background: 'none', border: 'none', cursor: 'pointer' }}>View All Workouts</button>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              {[
                { name: 'Full Body Sculpt', level: 'Intermediate', time: '45m', icon: '💪', color: 'linear-gradient(135deg, #6366f1, #a855f7)' },
                { name: 'Core Power HIIT', level: 'Advanced', time: '30m', icon: '🔥', color: 'linear-gradient(135deg, #ef4444, #f97316)' },
                { name: 'Morning Zen Yoga', level: 'Beginner', time: '20m', icon: '🧘', color: 'linear-gradient(135deg, #10b981, #3b82f6)' }
              ].map((item, i) => (
                <div key={i} onClick={() => setSelectedExercise({ label: item.name, icon: item.icon })} className="card" style={{ padding: '2rem', borderRadius: '2.5rem', cursor: 'pointer', position: 'relative', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div style={{ width: '70px', height: '70px', background: item.color, borderRadius: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'white', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 900, fontSize: '1.25rem' }}>{item.name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 700, marginTop: '0.25rem' }}>{item.level} • {item.time}</div>
                    </div>
                    <div style={{ marginLeft: 'auto', background: 'var(--bg-main)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Support':
        return (
          <div className="fade-in-page" style={{ paddingBottom: '5rem' }}>
            {/* Cinematic Hero Section - Shared Stage Design */}
            <div style={{ 
              position: 'relative', 
              height: '450px', 
              borderRadius: '4rem', 
              overflow: 'hidden', 
              marginBottom: '3rem', 
              boxShadow: '0 40px 80px -15px rgba(16, 185, 129, 0.3)',
              background: 'linear-gradient(135deg, #064e3b, #065f46)'
            }}>
               <img src={wellnessBg} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3, mixBlendMode: 'overlay' }} alt="" />
               <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(6, 78, 59, 0.95) 20%, transparent)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '5rem' }}>
                 <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
                    <span style={{ background: '#10b981', color: 'white', padding: '0.6rem 1.5rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '2px', boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)' }}>● ASSISTANT ONLINE</span>
                    <span style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.5rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 800, backdropFilter: 'blur(10px)' }}>AI POWERED</span>
                 </div>
                 <h1 style={{ color: 'white', fontSize: '4.5rem', fontWeight: 900, lineHeight: 1, marginBottom: '1.5rem', letterSpacing: '-2px' }}>Personalized <br/> <span style={{ background: 'linear-gradient(to right, #34d399, #6ee7b7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Health Support.</span></h1>
                 <p style={{ color: 'white', opacity: 0.7, fontSize: '1.2rem', fontWeight: 600, maxWidth: '600px', marginBottom: '3rem', lineHeight: 1.6 }}>Your dedicated partner in wellness. Ask about medications, nutrition, or wellness tips anytime, anywhere.</p>
                 <div style={{ display: 'flex', gap: '2rem' }}>
                    <button 
                      onClick={() => chatInputRef.current?.focus()}
                      style={{ padding: '1.5rem 3.5rem', background: 'white', color: '#064e3b', borderRadius: '2rem', fontWeight: 900, fontSize: '1.1rem', border: 'none', cursor: 'pointer', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '1rem' }}
                    >
                      CHAT NOW
                    </button>
                    <button 
                      onClick={() => {
                        const tips = [
                          "Consistency is key! Set a regular time for your medications to maintain steady levels.",
                          "Vitamin D is fat-soluble. Take it with a meal containing healthy fats for 30% better absorption.",
                          "Avoid screens 1 hour before bed to improve your recovery and sleep quality.",
                          "Stay hydrated! Aim for 2.5L of water daily to help your kidneys process medications.",
                          "Regular walking improves circulation and helps your body process medications more efficiently."
                        ];
                        const randomTip = tips[Math.floor(Math.random() * tips.length)];
                        setAssistantMsg(randomTip);
                      }}
                      style={{ padding: '1.5rem 3.5rem', background: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '2rem', fontWeight: 900, fontSize: '1.1rem', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', backdropFilter: 'blur(10px)' }}
                    >
                      VIEW TIPS
                    </button>
                 </div>
               </div>
            </div>

            <div style={{ padding: '0 2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4rem' }}>
                <div style={{ flex: 1.5 }}>
                  <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-1px' }}>Your Personal <br/> <span style={{ color: 'var(--primary)' }}>Health Assistant</span></h1>
                  <p style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-muted)', maxWidth: '600px', lineHeight: 1.6 }}>Ask questions about your medication, get nutrition tips, or find out how to improve your sleep quality using our AI-driven insights.</p>
                  
                  <div style={{ marginTop: '3rem', display: 'flex', gap: '1.5rem' }}>
                     <div 
                        className="card hover-lift" 
                        onClick={() => setAssistantMsg("Insight: Vitamin D is fat-soluble. To get the most out of your supplements, try taking them with your largest meal of the day!")}
                        style={{ padding: '2rem', flex: 1, background: 'var(--bg-card)', borderRadius: '2.5rem', border: '1px solid var(--border)', cursor: 'pointer' }}
                      >
                        <div style={{ width: '50px', height: '50px', background: '#fef3c7', color: '#f59e0b', borderRadius: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}><Zap /></div>
                        <h3 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Daily Insight</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Vitamin D absorption is 30% higher when taken with a meal containing healthy fats.</p>
                     </div>
                     <div 
                        className="card hover-lift" 
                        onClick={() => setAssistantMsg("Goal Update: You're doing great! Regular walking improves circulation and helps your body process medications more efficiently.")}
                        style={{ padding: '2rem', flex: 1, background: 'var(--bg-card)', borderRadius: '2.5rem', border: '1px solid var(--border)', cursor: 'pointer' }}
                      >
                        <div style={{ width: '50px', height: '50px', background: '#ecfdf5', color: '#10b981', borderRadius: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}><Activity /></div>
                        <h3 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Activity Goal</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>You are only 1,200 steps away from your daily target. Keep it up!</p>
                     </div>
                  </div>
                </div>

                <div style={{ flex: 1, background: 'linear-gradient(135deg, #1e1b4b, #312e81)', borderRadius: '3.5rem', padding: '3rem', color: 'white', boxShadow: '0 25px 50px -12px rgba(49, 46, 129, 0.3)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
                     <img src={healthAssistant} alt="Assistant" style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'white', padding: '5px' }} />
                     <div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>AI Med-Bot</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.7, fontWeight: 700 }}>Online & Ready to Help</div>
                     </div>
                  </div>
                  <div 
                    key={assistantMsg} 
                    className="fade-in"
                    style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '1.5rem', marginBottom: '2rem', fontSize: '0.9rem', lineHeight: 1.6, border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                     "{assistantMsg}"
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      ref={chatInputRef}
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                      placeholder="Ask me anything..." 
                      style={{ width: '100%', padding: '1.25rem 1.5rem', background: 'white', border: 'none', borderRadius: '1.25rem', color: '#1e1b4b', fontWeight: 700 }} 
                    />
                    <button 
                      onClick={handleChatSend}
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: '#6366f1', color: 'white', border: 'none', padding: '0.8rem 1.2rem', borderRadius: '1rem', fontWeight: 800, cursor: 'pointer' }}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>

              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '2.5rem' }}>Knowledge Base</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                 {[
                   { title: 'Medication Safety', icon: '🛡️', desc: 'Best practices for storing and taking your pills.', long: "Safety first! Keep your meds in their original containers, avoid bathroom storage (too humid), and always check expiration dates." },
                   { title: 'Nutrition Guide', icon: '🥗', desc: 'How food interacts with your medicine.', long: "Did you know? Some citrus fruits like grapefruit can interfere with certain meds. Check your specific labels for food interactions." },
                   { title: 'Sleep Hygiene', icon: '💤', desc: 'Improve your recovery with better sleep habits.', long: "Better sleep = faster recovery. Keep your room cool, dim the lights 30 mins before bed, and try to stick to a consistent wake-up time." }
                 ].map((item, i) => (
                   <div 
                     key={i} 
                     onClick={() => setAssistantMsg(item.long)}
                     className="card hover-lift" 
                     style={{ padding: '2.5rem', background: 'var(--bg-card)', borderRadius: '3rem', border: '1px solid var(--border)', cursor: 'pointer' }}
                   >
                     <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>{item.icon}</div>
                     <h3 style={{ fontWeight: 900, fontSize: '1.3rem', marginBottom: '0.5rem' }}>{item.title}</h3>
                     <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600, lineHeight: 1.5 }}>{item.desc}</p>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        );
      case 'Profile':
        return (
          <div className="fade-in-page">
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>User Profile</h1>
            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
              <div style={{ width: '120px', height: '120px', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 800, margin: '0 auto 2rem auto' }}>
                {localStorage.getItem('username')?.charAt(0).toUpperCase()}
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{localStorage.getItem('username')}</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Patient ID: #MED-{Math.floor(Math.random()*9000)+1000}</p>
              <button onClick={() => setIsHealthModalOpen(true)} className="secondary-btn" style={{ width: 'auto', padding: '0.8rem 2rem' }}>Update Health Metrics</button>
            </div>
          </div>
        );
      default:
        return (
          <div className="fade-in-page">
            <div className="dashboard-grid">
              <div className="left-col">
                <Carousel 
                  onAddClick={() => setIsModalOpen(true)} 
                  onProfileClick={() => setCurrentView('Profile')}
                  onExploreClick={() => setCurrentView('Support')}
                  onExerciseClick={() => setCurrentView('Exercise')}
                  onUpdateGoalsClick={() => setIsHealthModalOpen(true)}
                />

                {/* Quick Stats Grid (6 Cards to match screenshot) */}
                <h2 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '2.5rem 0 1.5rem', letterSpacing: '-0.5px' }}>Personalized Healthcare</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                  <div className="stat-card-lovable">
                    <div className="stat-info">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                         <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Water Goal</span>
                         <div style={{ color: '#0ea5e9', background: '#e0f2fe', padding: '6px', borderRadius: '8px' }}><Droplets size={18} /></div>
                      </div>
                      <div className="value" style={{ fontSize: '1.8rem', fontWeight: 900 }}>{healthData.water}L</div>
                    </div>
                  </div>
                  <div className="stat-card-lovable">
                    <div className="stat-info">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                         <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>BMI Index</span>
                         <div style={{ color: '#10b981', background: '#dcfce7', padding: '6px', borderRadius: '8px' }}><Activity size={18} /></div>
                      </div>
                      <div className="value" style={{ fontSize: '1.8rem', fontWeight: 900 }}>{healthData.bmi}</div>
                    </div>
                  </div>
                  <div className="stat-card-lovable">
                    <div className="stat-info">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                         <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Calories</span>
                         <div style={{ color: '#f59e0b', background: '#fef3c7', padding: '6px', borderRadius: '8px' }}><Zap size={18} /></div>
                      </div>
                      <div className="value" style={{ fontSize: '1.8rem', fontWeight: 900 }}>{healthData.calories}</div>
                    </div>
                  </div>
                  <div className="stat-card-lovable">
                    <div className="stat-info">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                         <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Medicines</span>
                         <div style={{ color: '#ef4444', background: '#fee2e2', padding: '6px', borderRadius: '8px' }}><Package size={18} /></div>
                      </div>
                      <div className="value" style={{ fontSize: '1.8rem', fontWeight: 900 }}>{medicines.length}</div>
                    </div>
                  </div>
                  <div className="stat-card-lovable">
                    <div className="stat-info">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                         <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Next Reminder</span>
                         <div style={{ color: '#6366f1', background: '#e0e7ff', padding: '6px', borderRadius: '8px' }}><Clock size={18} /></div>
                      </div>
                      <div className="value" style={{ fontSize: '1.8rem', fontWeight: 900 }}>13:00</div>
                    </div>
                  </div>
                  <div className="stat-card-lovable">
                    <div className="stat-info">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                         <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Daily Adherence</span>
                         <div style={{ color: '#10b981', background: '#dcfce7', padding: '6px', borderRadius: '8px' }}><Activity size={18} /></div>
                      </div>
                      <div className="value" style={{ fontSize: '1.8rem', fontWeight: 900 }}>100%</div>
                    </div>
                  </div>
                </div>

                {/* Featured Wellness Section */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                  <div className="glass-card" style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <span style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '0.75rem', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1px' }}>AI INSIGHTS</span>
                      <h2 style={{ fontSize: '2rem', fontWeight: 900, marginTop: '1rem', lineHeight: 1.2 }}>Optimize your <br/> wellness routine.</h2>
                      <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: '1rem 0 1.5rem', maxWidth: '80%', fontWeight: 600 }}>Your medication adherence is up by 15% this week. Keep it up for better recovery!</p>
                      <button onClick={() => setCurrentView('Support')} className="lovable-submit-btn" style={{ width: 'auto', padding: '0.8rem 2rem' }}>View Full Insights</button>
                    </div>
                    <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '250px', height: '250px', background: 'var(--primary-light)', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.4 }}></div>
                  </div>

                  <div 
                    className="glass-card" 
                    onClick={() => setIsHealthModalOpen(true)}
                    style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: 'white', border: 'none', padding: '2.5rem', cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <h3 style={{ fontWeight: 800, fontSize: '1.1rem' }}>Daily Progress</h3>
                      <Target size={20} />
                    </div>
                    <div style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.5rem' }}>75%</div>
                    <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.2)', borderRadius: '5px', overflow: 'hidden', marginBottom: '1rem' }}>
                      <div style={{ width: '75%', height: '100%', background: 'white' }}></div>
                    </div>
                    <p style={{ fontSize: '0.9rem', fontWeight: 600, opacity: 0.9 }}>You've taken 3 out of 4 doses today.</p>
                  </div>
                </div>

                {/* Medicine Section Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-1px' }}>Current Medications</h2>
                  <button onClick={() => setIsModalOpen(true)} className="lovable-submit-btn" style={{ width: 'auto', padding: '0.8rem 2rem', fontSize: '0.9rem' }}>
                    <Plus size={18} /> Add New
                  </button>
                </div>

                {/* Medications List */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                  {filteredMedicines.length === 0 ? (
                    <div className="glass-card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem' }}>
                      <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 600 }}>No medications scheduled for this view.</p>
                    </div>
                  ) : (
                    filteredMedicines.map(med => (
                      <div key={med.id} className="med-card-lovable">
                        <div className="med-header">
                          <div className="med-icon-box">
                            <Pill color={med.color || 'var(--primary)'} size={24} />
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => setIsModalOpen(med)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><Search size={18} /></button>
                            <button onClick={() => handleDeleteMedicine(med.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={18} /></button>
                          </div>
                        </div>
                        <div>
                          <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '4px' }}>{med.name}</h4>
                          <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>{med.dosage} • {med.reminderTime}</p>
                        </div>
                        <div className="med-footer">
                          <div className="stock-badge good">
                            {med.quantity} remaining
                          </div>
                          <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.8rem' }}>
                            NEXT DOSE: {med.reminderTime}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div style={{ marginTop: '3rem', marginBottom: '4rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 900 }}>Daily Wellness Session</h3>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fee2e2', color: '#ef4444', padding: '0.4rem 0.8rem', borderRadius: '0.75rem', fontSize: '0.7rem', fontWeight: 900 }}>
                      <span style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', animation: 'pulse 2s infinite' }}></span> LIVE NOW
                    </span>
                  </div>
                  <div onClick={() => setSelectedExercise({ label: 'Morning Zen Yoga', icon: '🧘' })} style={{ background: `url(${videoBg})`, height: '240px', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '2.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.4))' }}></div>
                    <div style={{ position: 'relative', zIndex: 2, background: 'rgba(255,255,255,0.25)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.3)', transition: 'transform 0.3s ease' }} className="hover-scale">
                      <Play size={32} color="white" fill="white" style={{ marginLeft: '4px' }} />
                    </div>
                    <div style={{ position: 'absolute', bottom: '1.5rem', left: '2rem', zIndex: 2 }}>
                      <p style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem', marginBottom: '4px' }}>Morning Zen Yoga</p>
                      <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', fontWeight: 600 }}>10 mins • Professional Guidance</p>
                    </div>
                  </div>
                </div>

                {/* Recent Activity Table */}
                <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginTop: '4rem', marginBottom: '2.5rem', letterSpacing: '-1px' }}>Recent Activity</h2>
                <div className="card" style={{ padding: '2.5rem', borderRadius: '3rem', background: 'var(--bg-card)', border: '1px solid var(--border)', overflow: 'hidden', marginBottom: '4rem' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                        <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 800 }}>EVENT</th>
                        <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 800 }}>MEDICINE</th>
                        <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 800 }}>STATUS</th>
                        <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 800 }}>TIME</th>
                      </tr>
                    </thead>
                    <tbody>
                      {medicines.slice(0, 3).map((m, i) => (
                        <tr key={i} style={{ borderBottom: i === 2 ? 'none' : '1px solid var(--border)' }}>
                          <td style={{ padding: '1.5rem 1rem', fontSize: '0.9rem', fontWeight: 700 }}>Dose Reminder</td>
                          <td style={{ padding: '1.5rem 1rem', fontSize: '0.9rem', fontWeight: 800 }}>{m.name}</td>
                          <td style={{ padding: '1.5rem 1rem' }}>
                            <span style={{ padding: '0.4rem 1rem', background: '#dcfce7', color: '#10b981', borderRadius: '0.75rem', fontSize: '0.75rem', fontWeight: 900 }}>COMPLETED</span>
                          </td>
                          <td style={{ padding: '1.5rem 1rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{i + 1}h ago</td>
                        </tr>
                      ))}
                      {medicines.length === 0 && (
                        <tr>
                          <td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>No recent activity to show.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Knowledge Base Section */}
                <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '2.5rem', letterSpacing: '-1px' }}>Health Knowledge Base</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                  {[
                    { title: 'Medication Safety', icon: '🛡️', desc: 'Best practices for storing and taking your pills.' },
                    { title: 'Nutrition Guide', icon: '🥗', desc: 'How food interacts with your medicine.' },
                    { title: 'Sleep Hygiene', icon: '💤', desc: 'Improve your recovery with better sleep habits.' }
                  ].map((item, i) => (
                    <div 
                      key={i} 
                      onClick={() => setCurrentView('Support')}
                      className="glass-card hover-lift" 
                      style={{ padding: '2rem', cursor: 'pointer', border: '1px solid var(--border)' }}
                    >
                      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{item.icon}</div>
                      <h3 style={{ fontWeight: 900, fontSize: '1.2rem', marginBottom: '0.5rem' }}>{item.title}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, lineHeight: 1.5 }}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>


              <div className="right-col">
                <div className="widget-card">
                  <h3 className="widget-title">Refill Alerts</h3>
                  {medicines.filter(m => m.quantity <= 5).map(m => (
                    <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{m.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 700 }}>{m.quantity} pills left</div>
                      </div>
                      <button 
                        onClick={() => handleRefill(m.id, m.quantity)} 
                        style={{ background: 'var(--primary)', color: 'white', border: 'none', fontSize: '0.7rem', fontWeight: 800, padding: '6px 12px', cursor: 'pointer', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.2)' }}
                      >
                        REFILL NOW
                      </button>
                    </div>
                  ))}
                </div>

                <div className="widget-card">
                  <h3 className="widget-title">Weekly Adherence</h3>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                    <div key={day} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, width: '30px', color: 'var(--text-muted)' }}>{day}</div>
                      <div style={{ flex: 1, height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.random()*40+60}%`, height: '100%', background: 'var(--primary)' }}></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="widget-card" style={{ padding: 0, overflow: 'hidden', height: '200px', position: 'relative' }}>
                  <img src={glowingPillBottle} alt="Pill Bottle" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.6))', display: 'flex', alignItems: 'flex-end', padding: '1rem' }}>
                    <span style={{ color: 'white', fontWeight: 800, fontSize: '0.8rem' }}>PREMIUM CARE</span>
                  </div>
                </div>

                <div className="widget-card" style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', color: 'white', border: 'none' }}>
                  <h3 className="widget-title" style={{ color: 'white' }}>Upcoming Workout</h3>
                  <div onClick={() => setCurrentView('Exercise')} style={{ display: 'flex', gap: '1rem', alignItems: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ width: '45px', height: '45px', background: 'var(--primary)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🧘</div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>Morning Zen Yoga</div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>20 min • Beginner</div>
                    </div>
                  </div>
                  <p style={{ marginTop: '1rem', fontSize: '0.75rem', opacity: 0.6, fontStyle: 'italic' }}>"Consistency is the key to mental clarity."</p>
                </div>

                <div className="widget-card" style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)', color: 'white', border: 'none', padding: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bot size={20} /></div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>AI Med-Bot Insight</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '1rem', fontSize: '0.8rem', lineHeight: 1.5, border: '1px solid rgba(255,255,255,0.1)' }}>
                    "Consistency is key! Set a regular time for your medications to maintain steady levels in your bloodstream."
                  </div>
                </div>

                <div className="widget-card" style={{ background: 'var(--bg-main)', border: '1px solid var(--border)' }}>
                  <h3 className="widget-title" style={{ fontSize: '0.9rem' }}>System Health</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Database: Online</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Reminders: Active</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Sync: Up to date</span>
                  </div>
                </div>

                <div className="widget-card">
                  <h3 className="widget-title">Quick Actions</h3>
                  <div onClick={() => setIsModalOpen(true)} className="nav-item" style={{ background: '#f8fafc', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', borderRadius: '1rem', marginBottom: '0.5rem' }}>
                    <Plus size={18} /> Add Medicine
                  </div>
                  <div onClick={() => navigate('/calendar')} className="nav-item" style={{ background: '#f8fafc', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', borderRadius: '1rem', marginBottom: '0.5rem' }}>
                    <CalendarIcon size={18} /> View Premium Calendar
                  </div>
                  <div onClick={() => setIsReminderOpen(true)} className="nav-item" style={{ background: '#f8fafc', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', borderRadius: '1rem', marginBottom: '0.5rem' }}>
                    <AlertCircle size={18} /> Send Reminder
                  </div>
                  <div onClick={() => {
                    alert("Triggering test... Please check for notification and sound.");
                    if (Notification.permission !== 'granted') Notification.requestPermission();
                    new Notification("Test Alert", { body: "Notifications are working correctly!", icon: '/vite.svg' });
                  }} className="nav-item" style={{ background: '#fef2f2', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', borderRadius: '1rem' }}>
                    <Bell size={18} /> Test Notification
                  </div>
                </div>
                
                {/* Floating Health Assistant for Quick Access */}
                <div style={{ position: 'fixed', bottom: '2.5rem', right: '2.5rem', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ background: 'var(--bg-card)', padding: '0.8rem 1.2rem', borderRadius: '1.5rem', boxShadow: 'var(--shadow)', border: '1px solid var(--primary)', marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)' }}>
                    Need Tips? 🩺
                  </div>
                  <img 
                    src={healthAssistant} 
                    alt="Assistant" 
                    onClick={() => setCurrentView('Support')}
                    className="animate-float" 
                    style={{ width: '90px', height: 'auto', cursor: 'pointer', filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.15))' }} 
                  />
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-wrapper">
      <aside className="sidebar" style={{ width: isSidebarExpanded ? '260px' : '80px', transition: 'width 0.3s', padding: '2rem', height: '100vh', background: 'var(--bg-card)', borderRight: '1px solid var(--border)', position: 'fixed', zIndex: 100 }} onMouseEnter={() => setIsSidebarExpanded(true)} onMouseLeave={() => setIsSidebarExpanded(false)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
          <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800 }}>M</div>
          {isSidebarExpanded && <span style={{ fontWeight: 800, fontSize: '1.2rem' }}>MedReminder</span>}
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div onClick={() => setCurrentView('Home')} className={`nav-item ${currentView === 'Home' ? 'active' : ''}`} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '0.75rem', borderRadius: '1rem' }}>
            <Home size={22} /> {isSidebarExpanded && 'Dashboard'}
          </div>
          <div onClick={() => navigate('/calendar')} className="nav-item" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '0.75rem', borderRadius: '1rem' }}>
            <CalendarIcon size={22} /> {isSidebarExpanded && 'Calendar'}
          </div>
          <div onClick={() => setCurrentView('Inventory')} className={`nav-item ${currentView === 'Inventory' ? 'active' : ''}`} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '0.75rem', borderRadius: '1rem' }}>
            <Package size={22} /> {isSidebarExpanded && 'Inventory'}
          </div>
          <div onClick={() => setCurrentView('Reports')} className={`nav-item ${currentView === 'Reports' ? 'active' : ''}`} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '0.75rem', borderRadius: '1rem' }}>
            <FileText size={22} /> {isSidebarExpanded && 'Reports'}
          </div>
          <div onClick={() => setCurrentView('Exercise')} className={`nav-item ${currentView === 'Exercise' ? 'active' : ''}`} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '0.75rem', borderRadius: '1rem' }}>
            <Activity size={22} /> {isSidebarExpanded && 'Exercise Hub'}
          </div>
          <div onClick={() => setCurrentView('Support')} className={`nav-item ${currentView === 'Support' ? 'active' : ''}`} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '0.75rem', borderRadius: '1rem' }}>
            <UserIcon size={22} /> {isSidebarExpanded && 'Health Assistant'}
          </div>
          <div onClick={() => setCurrentView('Profile')} className={`nav-item ${currentView === 'Profile' ? 'active' : ''}`} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '0.75rem', borderRadius: '1rem' }}>
            <UserIcon size={22} /> {isSidebarExpanded && 'Profile'}
          </div>
          <div style={{ marginTop: 'auto' }}>
            <div onClick={() => { localStorage.clear(); window.location.reload(); }} className="nav-item" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '0.75rem', color: '#ef4444' }}>
              <LogOut size={22} /> {isSidebarExpanded && 'Logout'}
            </div>
          </div>
        </nav>
      </aside>

      <main className="main-content" style={{ marginLeft: isSidebarExpanded ? '260px' : '80px', padding: '2rem 3rem', flex: 1 }}>
        <header className="top-bar">
          <div className="search-container">
            <Search size={20} color="var(--text-muted)" />
            <input type="text" placeholder="Search medicines..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <button onClick={toggleTheme} className="circle-btn" style={{ background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border)' }}>
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{currentTime.toLocaleDateString()}</div>
            </div>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowNotifications(!showNotifications)} className="circle-btn" style={{ position: 'relative' }}>
                <Bell size={20} />
                {notifications.length > 0 && <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: 'white', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '10px' }}>{notifications.length}</span>}
              </button>
              {showNotifications && (
                <div style={{ position: 'absolute', top: '60px', right: 0, width: '300px', background: 'var(--bg-card)', borderRadius: '1.5rem', boxShadow: 'var(--shadow)', padding: '1.5rem', zIndex: 1000, border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ fontWeight: 800 }}>Notifications</h4>
                    <X size={16} onClick={() => setShowNotifications(false)} style={{ cursor: 'pointer' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {notifications.length === 0 ? <p style={{ textAlign: 'center', fontSize: '0.8rem' }}>No new alerts</p> : notifications.map(n => (
                      <div key={n.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0.75rem', background: '#fff1f2', borderRadius: '1rem' }}>
                        <AlertCircle size={16} color="#ef4444" />
                        <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>{n.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="user-profile">
              <div className="avatar">{localStorage.getItem('username')?.charAt(0).toUpperCase()}</div>
              <div style={{ fontWeight: 800 }}>{localStorage.getItem('username')}</div>
            </div>
          </div>
        </header>

        {renderContent()}
      </main>

      <AddMedicineModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={async (data) => { 
        try {
          await medicineService.create(data); 
          setIsModalOpen(false); 
          fetchMedicines();
        } catch (err) {
          console.error("ADD ERROR:", err);
          alert("Failed to add medicine. " + (err.response?.data?.msg || err.message));
        }
      }} />
      <HealthProfileModal isOpen={isHealthModalOpen} onClose={() => setIsHealthModalOpen(false)} onUpdate={(newData) => {
        setHealthData(newData);
        localStorage.setItem('healthData', JSON.stringify(newData));
      }} />
      <ExerciseModal isOpen={!!selectedExercise} onClose={() => setSelectedExercise(null)} exercise={selectedExercise} />
      <SendReminderModal isOpen={isReminderOpen} onClose={() => setIsReminderOpen(false)} medicines={medicines} />
      <ReminderPopup medicine={activeReminder} onClose={() => setActiveReminder(null)} onAction={() => handleTakeMedicine(activeReminder)} />
    </div>
  );
};

export default Dashboard;
