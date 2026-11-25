// ========================================================
// MedReminder Main Application Logic (Vanilla JavaScript)
// ========================================================

let currentMedicines = [];
let workoutInterval = null;
let workoutSeconds = 60;
let isWorkingOut = false;

// Check authentication on load
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login.html';
    return;
  }

  // Display user role & greeting
  const username = localStorage.getItem('username') || 'Patient';
  const role = localStorage.getItem('role') || 'user';
  document.getElementById('user-greeting').textContent = `Welcome, ${username}!`;

  if (role === 'admin') {
    const adminLink = document.getElementById('admin-nav-link');
    if (adminLink) adminLink.style.display = 'flex';
  }

  loadMedicines();
  startLiveClock();
  startReminderEngine();
});

// 1. Clock & Greeting
function startLiveClock() {
  const clockEl = document.getElementById('current-clock');
  const update = () => {
    const now = new Date();
    clockEl.textContent = now.toLocaleDateString('en-US', {
      weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  };
  update();
  setInterval(update, 1000);
}

// 2. Load Medicines from Java Spring Boot REST API
async function loadMedicines() {
  try {
    const list = await medicineService.getAll();
    currentMedicines = list || [];
    renderMedicines(currentMedicines);
  } catch (err) {
    console.error('Failed to load medicines:', err);
  }
}

function renderMedicines(medicines) {
  const container = document.getElementById('medicine-list-container');
  const countBadge = document.getElementById('med-count-badge');
  countBadge.textContent = `${medicines.length} Active`;

  if (medicines.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem; background: var(--card-bg); border-radius: var(--radius-lg); border: 1px dashed var(--border-glass);">
        <p style="font-weight: 700; color: var(--text-muted);">No medicines scheduled yet.</p>
        <button class="btn-primary" onclick="openAddModal()" style="margin: 1rem auto 0 auto;">➕ Add First Medicine</button>
      </div>
    `;
    return;
  }

  container.innerHTML = medicines.map(med => {
    const isLow = med.quantity <= 5;
    return `
      <div class="med-card">
        <div class="med-left">
          <div class="med-icon-pill">💊</div>
          <div class="med-details">
            <h3>${escapeHtml(med.name)} <span class="dosage-badge">${escapeHtml(med.dosage)}</span></h3>
            <div class="med-meta">
              <span>⏰ ${med.reminderTime}</span>
              <span>🍽️ ${med.mealType || 'after food'}</span>
              <span class="stock-pill ${isLow ? 'stock-low' : 'stock-good'}">
                ${isLow ? '⚠️ Low Stock: ' : '📦 Stock: '}${med.quantity} left
              </span>
            </div>
          </div>
        </div>
        <div class="med-actions">
          <button class="btn-primary" style="padding: 0.5rem 1rem; font-size: 0.8rem;" onclick="refillMedicine(${med.id}, ${med.quantity})">
            + Refill
          </button>
          <button class="btn-icon" onclick="deleteMedicineItem(${med.id})" title="Delete">
            🗑️
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// 3. Add Medicine
function openAddModal() {
  document.getElementById('add-modal').classList.add('active');
}

function closeAddModal() {
  document.getElementById('add-modal').classList.remove('active');
}

async function handleAddMedicine(e) {
  e.preventDefault();
  const payload = {
    name: document.getElementById('med-name').value.trim(),
    dosage: document.getElementById('med-dosage').value.trim(),
    reminderTime: document.getElementById('med-time').value,
    mealType: document.getElementById('med-meal').value,
    quantity: parseInt(document.getElementById('med-quantity').value) || 30,
    totalQuantity: 30,
    doctorEmail: document.getElementById('med-email').value.trim()
  };

  try {
    await medicineService.create(payload);
    closeAddModal();
    loadMedicines();
  } catch (err) {
    alert(err.message || 'Error saving medicine');
  }
}

// 4. Refill Stock (+10 pills)
async function refillMedicine(id, currentQuantity) {
  try {
    await medicineService.update(id, { quantity: currentQuantity + 10 });
    loadMedicines();
  } catch (err) {
    alert('Failed to refill stock: ' + err.message);
  }
}

// 5. Delete Medicine
async function deleteMedicineItem(id) {
  if (!confirm('Are you sure you want to remove this medicine?')) return;
  try {
    await medicineService.delete(id);
    loadMedicines();
  } catch (err) {
    alert('Failed to delete medicine: ' + err.message);
  }
}

// 6. Reminder Engine & Audio Alerts
function startReminderEngine() {
  setInterval(() => {
    const now = new Date();
    const currentHHMM = now.toTimeString().substring(0, 5); // "08:00"

    const matchingMed = currentMedicines.find(m => m.reminderTime === currentHHMM);
    if (matchingMed) {
      triggerReminder(matchingMed);
    }
  }, 30000);
}

function triggerReminder(med) {
  const popup = document.getElementById('reminder-popup');
  const msg = document.getElementById('reminder-popup-msg');
  const audio = document.getElementById('chime-audio');

  msg.textContent = `Time for ${med.name} (${med.dosage}) - ${med.mealType || 'after food'}`;
  popup.style.display = 'flex';

  if (audio) {
    audio.play().catch(() => console.log('Audio autoplay blocked until user interaction'));
  }

  // Also trigger browser desktop notification if permitted
  if (Notification.permission === 'granted') {
    new Notification(`MedReminder: ${med.name}`, {
      body: `Dosage: ${med.dosage}. Remember to take it ${med.mealType}!`,
      icon: 'assets/glowing_pill_bottle-B7QXTHn8.png'
    });
  }
}

function dismissReminder() {
  document.getElementById('reminder-popup').style.display = 'none';
}

// 7. Cartoon Doctor Assistant Chatbot
function handleDoctorChat() {
  const input = document.getElementById('doctor-chat-input');
  const bubble = document.getElementById('doctor-speech-bubble');
  const query = input.value.trim().toLowerCase();

  if (!query) return;

  bubble.textContent = 'Thinking... 🩺';

  setTimeout(() => {
    if (query.includes('water') || query.includes('drink')) {
      bubble.textContent = "Drinking 2-3 liters of water daily keeps kidneys clean and helps medication absorption!";
    } else if (query.includes('food') || query.includes('meal') || query.includes('eat')) {
      bubble.textContent = "Always check whether each pill is 'before' or 'after' food to protect your stomach.";
    } else if (query.includes('exercise') || query.includes('workout')) {
      bubble.textContent = "Even a 15-minute Morning Zen Yoga session boosts circulation and lowers blood pressure!";
    } else if (query.includes('side effect') || query.includes('dizzy')) {
      bubble.textContent = "Mild dizziness can occur with some antibiotics and blood pressure pills. Rest and consult your doctor if persistent.";
    } else {
      bubble.textContent = "I'm always here to help you stay on track! Make sure to take your doses on time today.";
    }
  }, 600);

  input.value = '';
}

// 8. Guided Workout Coach Modal
const workoutPlans = {
  'Morning Zen Yoga': {
    desc: 'A gentle flow to wake up your body and mind with calm breath control.',
    steps: ['1. Child\'s Pose (Relax shoulders)', '2. Cat-Cow Spine Stretch', '3. Sun Salutations', '4. Savasana Breathing']
  },
  'Full Body Sculpt': {
    desc: 'Intermediate sculpt session for total body toning and endurance.',
    steps: ['1. Goblet Squats (15 reps)', '2. Overhead Shoulder Press', '3. Glute Bridges', '4. Core Plank Rows']
  },
  'Core Power HIIT': {
    desc: 'High-energy core strength and cardiovascular fat-burn flow.',
    steps: ['1. Bicycle Crunches (30s)', '2. Burpees (10 reps)', '3. Mountain Climbers', '4. Plank Jacks']
  },
  'Pilates': {
    desc: 'Focus on control, deep breath work, spinal balance, and core stability.',
    steps: ['1. The Hundred (Deep Breathing)', '2. Single Leg Stretch', '3. Criss Cross Abs', '4. Spinal Roll-up']
  }
};

function openExerciseModal(name) {
  const modal = document.getElementById('exercise-modal');
  const plan = workoutPlans[name] || workoutPlans['Morning Zen Yoga'];

  document.getElementById('exercise-title').textContent = name;
  document.getElementById('exercise-desc').textContent = plan.desc;
  document.getElementById('exercise-steps').innerHTML = plan.steps.map(s => `
    <div style="display: flex; gap: 0.75rem; align-items: center; font-weight: 700; font-size: 0.95rem;">
      <span style="color: var(--primary);">✓</span> ${s}
    </div>
  `).join('');

  workoutSeconds = 60;
  isWorkingOut = false;
  document.getElementById('exercise-timer-display').textContent = '01:00';
  document.getElementById('exercise-status-text').textContent = 'Ready to Start';
  document.getElementById('exercise-start-btn').textContent = '▶ Start "Do with Me" Session';

  modal.classList.add('active');
}

function closeExerciseModal() {
  document.getElementById('exercise-modal').classList.remove('active');
  if (workoutInterval) clearInterval(workoutInterval);
}

function toggleWorkoutTimer() {
  const btn = document.getElementById('exercise-start-btn');
  const timerDisplay = document.getElementById('exercise-timer-display');
  const statusText = document.getElementById('exercise-status-text');

  if (isWorkingOut) {
    clearInterval(workoutInterval);
    isWorkingOut = false;
    btn.textContent = '▶ Resume Session';
    statusText.textContent = 'Paused';
  } else {
    isWorkingOut = true;
    btn.textContent = '⏸ Pause Session';
    statusText.textContent = 'Coach Session: In Progress';

    workoutInterval = setInterval(() => {
      workoutSeconds--;
      const mins = Math.floor(workoutSeconds / 60);
      const secs = workoutSeconds % 60;
      timerDisplay.textContent = `0${mins}:${secs < 10 ? '0' : ''}${secs}`;

      if (workoutSeconds <= 0) {
        clearInterval(workoutInterval);
        isWorkingOut = false;
        timerDisplay.textContent = '00:00';
        statusText.textContent = '🎉 Workout Completed! Great job!';
        btn.textContent = '▶ Start Again';
      }
    }, 1000);
  }
}

// 9. Nudge / Doctor Alert Modal
function openNudgeModal() {
  const firstDoctor = currentMedicines.find(m => m.doctorEmail)?.doctorEmail || 'doctor@clinic.com';
  const username = localStorage.getItem('username') || 'Patient';
  const subject = encodeURIComponent(`MedReminder Check-in: ${username}`);
  const body = encodeURIComponent(`Hello Doctor,\n\nThis is a check-in regarding my medication schedule.\nPatient: ${username}\nActive meds: ${currentMedicines.map(m=>m.name).join(', ')}\n\nThank you!`);
  window.location.href = `mailto:${firstDoctor}?subject=${subject}&body=${body}`;
}

// 10. Theme & Auth
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}

function logout() {
  localStorage.clear();
  window.location.href = '/login.html';
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
}
