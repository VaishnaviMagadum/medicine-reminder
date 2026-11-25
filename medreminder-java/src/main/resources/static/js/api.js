// ========================================================
// API Service: Handles communication with Java Spring Boot
// ========================================================

const API_BASE = '/api/';

const api = {
  getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  async request(endpoint, options = {}) {
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...(options.headers || {})
      }
    };

    const response = await fetch(`${API_BASE}${endpoint}`, config);

    // If unauthorized or token invalid, redirect to login
    if (response.status === 401 && !window.location.pathname.includes('login.html')) {
      localStorage.clear();
      window.location.href = '/login.html';
      return null;
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({ msg: 'Server error' }));
      throw new Error(errData.msg || 'Request failed');
    }

    // Return JSON if present
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    return null;
  }
};

// Auth endpoints
const authService = {
  login: (data) => api.request('auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data) => api.request('auth/register', { method: 'POST', body: JSON.stringify(data) }),
  health: () => api.request('health')
};

// Medicines CRUD endpoints
const medicineService = {
  getAll: () => api.request('medicines'),
  getById: (id) => api.request(`medicines/${id}`),
  create: (data) => api.request('medicines', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => api.request(`medicines/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => api.request(`medicines/${id}`, { method: 'DELETE' }),
  sendAlert: (id) => api.request(`medicines/alert/${id}`, { method: 'POST' })
};

// Admin endpoints
const adminService = {
  getStats: () => api.request('admin/stats'),
  getUsers: () => api.request('admin/users'),
  getMedicines: () => api.request('admin/medicines')
};
