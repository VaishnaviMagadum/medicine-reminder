import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { User, Lock, ArrowRight, Activity, ShieldCheck, Zap, Rocket } from 'lucide-react';

const Login = ({ setIsAuthenticated, handleAuthUpdate }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = isLogin ? await authService.login(formData) : await authService.register(formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('role', res.data.role || 'user');
      if (handleAuthUpdate) handleAuthUpdate();
      setIsAuthenticated(true);
      navigate(res.data.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lovable-login-wrapper">
      <div className="login-bg-overlay"></div>
      
      {/* Decorative Glows */}
      <div className="bg-glow-1"></div>
      <div className="bg-glow-2"></div>

      <div className="glass-login-container">
        <div className="app-logo-premium">
          <Activity size={32} color="#6366f1" strokeWidth={2.5} />
        </div>

        <div className="login-header">
          <h1>Mediverse Buddy</h1>
          <p className="subtitle">Your intelligent health partner</p>
        </div>

        <div className="auth-type-selector">
          <button 
            className={!isAdminMode ? 'active' : ''} 
            onClick={() => { setIsAdminMode(false); setIsLogin(true); setError(''); }}
          >
            User
          </button>
          <button 
            className={isAdminMode ? 'active' : ''} 
            onClick={() => { setIsAdminMode(true); setIsLogin(true); setError(''); setFormData({ username: 'admin', password: '' }); }}
          >
            Admin
          </button>
        </div>

        {error && (
          <div className="auth-error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="lovable-form">
          <div className="input-icon-wrapper">
            <User size={18} className="field-icon" />
            <input 
              type="text" 
              required 
              placeholder="Username"
              value={formData.username}
              onChange={e => setFormData({...formData, username: e.target.value})}
            />
          </div>

          <div className="input-icon-wrapper">
            <Lock size={18} className="field-icon" />
            <input 
              type="password" 
              required 
              placeholder="Password"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button type="submit" className="lovable-submit-btn" disabled={loading}>
            {loading ? 'Processing...' : 'Sign In'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="auth-toggle">
          <span>{isLogin ? "New here?" : "Joined already?"}</span>
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }}>
            {isLogin ? 'Create Account' : 'Sign In'}
          </button>
        </div>

        <div className="trust-badges">
          <div className="badge">
            <ShieldCheck size={14} />
            SECURE
          </div>
          <div className="badge">
            <Activity size={14} />
            LIVE SYNC
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

