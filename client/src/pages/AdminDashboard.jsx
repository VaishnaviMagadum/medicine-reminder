import React, { useState, useEffect } from 'react';
import { Users, Pill, Activity, Settings, LogOut, Search, Plus, Filter, Bell, UserPlus, AlertTriangle, RefreshCcw } from 'lucide-react';
import { adminService } from '../services/api';

const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState('Overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeMeds: 0,
    alertsToday: 0,
    systemStatus: 'Loading...'
  });
  const [users, setUsers] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching Admin Data...');
      
      const statsRes = await adminService.getStats().catch(err => {
        console.error('Stats fetch failed:', err);
        throw new Error(`Stats: ${err.response?.status} ${err.response?.data?.msg || err.message}`);
      });
      setStats(statsRes.data);

      const usersRes = await adminService.getUsers().catch(err => {
        console.error('Users fetch failed:', err);
        throw new Error(`Users: ${err.response?.status} ${err.response?.data?.msg || err.message}`);
      });
      setUsers(usersRes.data);

      const medsRes = await adminService.getMedicines().catch(err => {
        console.error('Medicines fetch failed:', err);
        throw new Error(`Meds: ${err.response?.status} ${err.response?.data?.msg || err.message}`);
      });
      setMedicines(medsRes.data);

    } catch (err) {
      console.error('Final Admin Fetch Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const renderContent = () => {
    if (loading && stats.totalUsers === 0) {
      return (
        <div className="admin-loading">
          <RefreshCcw className="animate-spin" />
          <p>Syncing system data...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="admin-error-card pro-card-shadow">
          <AlertTriangle size={48} color="#ef4444" />
          <h2>Access Error</h2>
          <p>{error}</p>
          <button onClick={fetchData} className="pro-btn-primary">Retry Sync</button>
        </div>
      );
    }

    switch(currentView) {
      case 'User Management':
        return (
          <div className="admin-view-section">
            <div className="section-header">
              <h1>User Management</h1>
              <button className="pro-btn-primary"><UserPlus size={18} /> Add New User</button>
            </div>
            <div className="activity-table-container pro-card-shadow">
              <table className="activity-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>#{user.id}</td>
                      <td>
                        <div className="user-cell">
                          <div className="avatar-small">{user.username.charAt(0).toUpperCase()}</div>
                          <span>{user.username}</span>
                        </div>
                      </td>
                      <td><span className={`role-tag ${user.role}`}>{user.role}</span></td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button className="text-btn">Manage</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'Medicine Database':
        return (
          <div className="admin-view-section">
            <div className="section-header">
              <h1>Global Medicine Database</h1>
              <button className="pro-btn-primary"><Plus size={18} /> Global Registration</button>
            </div>
            <div className="activity-table-container pro-card-shadow">
              <table className="activity-table">
                <thead>
                  <tr>
                    <th>Med ID</th>
                    <th>Medicine Name</th>
                    <th>Owner (User)</th>
                    <th>Dosage</th>
                    <th>Stock</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {medicines.map(med => (
                    <tr key={med.id}>
                      <td>#MED-{med.id}</td>
                      <td><strong>{med.name}</strong></td>
                      <td>{med.User?.username || 'Unknown'}</td>
                      <td>{med.dosage}</td>
                      <td>{med.quantity} Units</td>
                      <td>
                        <span className={`status-tag ${med.quantity <= 5 ? 'warning' : 'success'}`}>
                          {med.quantity <= 5 ? 'Low Stock' : 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'System Alerts':
        return (
          <div className="admin-view-section">
            <div className="section-header">
              <h1>Real-time System Alerts</h1>
            </div>
            <div className="alerts-list">
              {[1, 2].map(i => (
                <div key={i} className="alert-item-pro pro-card-shadow">
                  <AlertTriangle color="#ef4444" />
                  <div className="alert-info">
                    <h4>{i === 1 ? 'High Priority: Database Optimization' : 'Security: Failed Login Attempts'}</h4>
                    <p>{i === 1 ? 'Regional database sync delayed by 120ms.' : 'Multiple failed attempts detected from IP 192.168.1.10'}</p>
                  </div>
                  <span className="alert-time">{i * 5} mins ago</span>
                </div>
              ))}
              <div className="alert-item-pro pro-card-shadow success-alert">
                <Activity color="#10b981" />
                <div className="alert-info">
                  <h4>Email Server Online</h4>
                  <p>Automatic reminder system is functioning correctly.</p>
                </div>
                <span className="alert-time">Just now</span>
              </div>
            </div>
          </div>
        );
      case 'Settings':
        return (
          <div className="admin-view-section">
            <div className="section-header">
              <h1>Admin Configurations</h1>
            </div>
            <div className="settings-grid-pro">
              <div className="settings-card pro-card-shadow">
                <h3>System Maintenance</h3>
                <p>Clean up old logs and optimize database indices.</p>
                <button className="secondary-btn-pro">Run Maintenance</button>
              </div>
              <div className="settings-card pro-card-shadow">
                <h3>Global Alerts</h3>
                <p>Broadcast a system-wide announcement to all users.</p>
                <button className="secondary-btn-pro">Broadcast</button>
              </div>
              <div className="settings-card pro-card-shadow">
                <h3>Security Audit</h3>
                <p>Generate a report of all administrative actions.</p>
                <button className="secondary-btn-pro">View Logs</button>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <>
            <div className="welcome-section">
              <h1>System Overview</h1>
              <p>Welcome back, Administrator. Real-time system monitoring active.</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card-admin">
                <div className="stat-icon users"><Users /></div>
                <div className="stat-info">
                  <h3>Total Users</h3>
                  <p className="stat-value-admin">{stats.totalUsers}</p>
                  <span className="stat-trend positive">Active accounts</span>
                </div>
              </div>
              <div className="stat-card-admin">
                <div className="stat-icon meds"><Pill /></div>
                <div className="stat-info">
                  <h3>Active Medicines</h3>
                  <p className="stat-value-admin">{stats.activeMeds}</p>
                  <span className="stat-trend positive">Tracked globally</span>
                </div>
              </div>
              <div className="stat-card-admin">
                <div className="stat-icon alerts"><Bell /></div>
                <div className="stat-info">
                  <h3>Alerts Sent</h3>
                  <p className="stat-value-admin">{stats.alertsToday}</p>
                  <span className="stat-trend neutral">Today's count</span>
                </div>
              </div>
              <div className="stat-card-admin">
                <div className="stat-icon status"><Activity /></div>
                <div className="stat-info">
                  <h3>System Status</h3>
                  <p className="stat-value-admin">{stats.systemStatus}</p>
                  <span className="stat-trend positive">Healthy</span>
                </div>
              </div>
            </div>

            <div className="recent-activity">
              <div className="section-header">
                <h2>Recent System Activity</h2>
                <button className="view-all" onClick={() => setCurrentView('Medicine Database')}>View All Meds</button>
              </div>
              <div className="activity-table-container pro-card-shadow">
                <table className="activity-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Medicine</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Date Added</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicines.slice(0, 5).map(med => (
                      <tr key={med.id}>
                        <td>{med.User?.username}</td>
                        <td>{med.name}</td>
                        <td>{med.quantity}</td>
                        <td>
                          <span className={`status-tag ${med.quantity <= 5 ? 'warning' : 'success'}`}>
                            {med.quantity <= 5 ? 'Low' : 'OK'}
                          </span>
                        </td>
                        <td>{new Date(med.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="admin-container fade-in-page">
      <aside className="admin-sidebar">
        <div className="admin-logo" onClick={() => setCurrentView('Overview')} style={{ cursor: 'pointer' }}>
          <div className="logo-icon">M</div>
          <span>MedAdmin</span>
        </div>
        
        <nav className="admin-nav">
          <button 
            onClick={() => setCurrentView('Overview')} 
            className={`nav-item ${currentView === 'Overview' ? 'active' : ''}`}
          >
            <Activity size={20} /> Overview
          </button>
          <button 
            onClick={() => setCurrentView('User Management')} 
            className={`nav-item ${currentView === 'User Management' ? 'active' : ''}`}
          >
            <Users size={20} /> User Management
          </button>
          <button 
            onClick={() => setCurrentView('Medicine Database')} 
            className={`nav-item ${currentView === 'Medicine Database' ? 'active' : ''}`}
          >
            <Pill size={20} /> Medicine Database
          </button>
          <button 
            onClick={() => setCurrentView('System Alerts')} 
            className={`nav-item ${currentView === 'System Alerts' ? 'active' : ''}`}
          >
            <Bell size={20} /> System Alerts
          </button>
          <button 
            onClick={() => setCurrentView('Settings')} 
            className={`nav-item ${currentView === 'Settings' ? 'active' : ''}`}
          >
            <Settings size={20} /> Settings
          </button>
        </nav>

        <button onClick={handleLogout} className="logout-btn-admin">
          <LogOut size={20} /> Logout
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div className="search-bar">
            <Search size={18} color="#94a3b8" />
            <input type="text" placeholder={`Search ${currentView.toLowerCase()}...`} />
          </div>
          <div className="admin-profile">
            <button onClick={fetchData} className="refresh-btn" title="Refresh Data">
              <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
            <div className="notifications">
              <Bell size={20} />
              <span className="badge">{stats.alertsToday}</span>
            </div>
            <div className="avatar">AD</div>
          </div>
        </header>

        <div className="admin-content">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
