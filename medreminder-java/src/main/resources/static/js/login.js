let isLoginMode = true;
let currentRole = 'user';

function switchRole(role) {
  currentRole = role;
  document.getElementById('user-role-tab').classList.toggle('active', role === 'user');
  document.getElementById('admin-role-tab').classList.toggle('active', role === 'admin');

  if (role === 'admin') {
    document.getElementById('username').value = 'admin';
    document.getElementById('password').value = 'adminpassword';
  } else {
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
  }
}

function toggleAuthMode() {
  isLoginMode = !isLoginMode;
  document.getElementById('submit-btn').textContent = isLoginMode ? 'Sign In →' : 'Create Account →';
  document.getElementById('auth-toggle-text').textContent = isLoginMode ? 'New here?' : 'Joined already?';
  document.getElementById('auth-toggle-btn').textContent = isLoginMode ? 'Create Account' : 'Sign In';
  document.getElementById('auth-error').style.display = 'none';
}

async function handleAuthSubmit(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const errorBox = document.getElementById('auth-error');

  errorBox.style.display = 'none';

  try {
    const payload = { username, password };
    const res = isLoginMode 
      ? await authService.login(payload) 
      : await authService.register(payload);

    localStorage.setItem('token', res.token);
    localStorage.setItem('username', res.username);
    localStorage.setItem('role', res.role || 'user');

    if (res.role === 'admin') {
      window.location.href = '/admin.html';
    } else {
      window.location.href = '/index.html';
    }
  } catch (err) {
    errorBox.textContent = err.message || 'Authentication failed. Please check credentials.';
    errorBox.style.display = 'block';
  }
}

function instantDemoLogin() {
  // Uses pre-seeded demo user
  document.getElementById('username').value = 'demo';
  document.getElementById('password').value = 'demo123';
  handleAuthSubmit(new Event('submit'));
}
