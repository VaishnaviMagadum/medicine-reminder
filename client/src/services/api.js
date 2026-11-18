import axios from 'axios';

const API_URL = 'http://localhost:10000/api/';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const medicineService = {
  getAll: () => api.get('medicines'),
  getById: (id) => api.get(`medicines/${id}`),
  create: (data) => api.post('medicines', data),
  update: (id, data) => api.put(`medicines/${id}`, data),
  delete: (id) => api.delete(`medicines/${id}`)
};

export const authService = {
  login: (data) => api.post('auth/login', data),
  register: (data) => api.post('auth/register', data)
};

export const adminService = {
  getStats: () => api.get('admin/stats'),
  getUsers: () => api.get('admin/users'),
  getMedicines: () => api.get('admin/medicines')
};

export default api;
