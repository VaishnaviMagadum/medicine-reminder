# MedReminder - Your Daily Health Friend 💊

A premium, full-stack healthcare application designed to manage medications, track health metrics, and provide guided physical exercises. Built for the modern patient, MedReminder focuses on local privacy, high-performance UI, and interactive health guidance.

---

## 🌟 Exhibition Highlights
- **Interactive Exercise Coach**: Features a "Do with Me" workout mode with an **animated girl coach**, live countdown timers, and professional step-by-step guidance.
- **Smart Health Assistant**: A friendly **animated cartoon doctor** that provides daily health tips and simulated AI insights.
- **Dynamic Health Dashboard**: Real-time tracking of **BMI**, **Daily Water Goals**, and **Calories** using persistent local storage.
- **Intelligent Reminder Engine**: Cross-platform browser notifications paired with a custom high-fidelity audio alert system.
- **Medical Report Center**: Generates clean, exportable medication schedules for doctors and caregivers.

---

## 🛠️ Technical Architecture (MERN Stack)
### **Frontend (The Face)**
- **React (Vite)**: For a blazing-fast, responsive user experience.
- **Tailwind CSS**: Modern styling with custom glassmorphism effects.
- **Framer Motion**: Smooth, high-end page transitions and micro-animations.
- **Lucide React**: Premium icon set for a clean medical look.

### **Backend (The Brain)**
- **Node.js & Express**: High-performance API handling and business logic.
- **SQLite (Sequelize ORM)**: Zero-setup database that ensures your data is saved locally and remains private.
- **JWT & Bcrypt**: Secure user authentication and data encryption.

---

## 📂 Project Structure
- `client/`: The React frontend application.
- `server/`: The Node.js/Express backend and SQLite database.
- `client/src/pages/`: Core UI views (Dashboard, Calendar, Login).
- `client/src/components/`: Reusable components (Health Assistant, Exercise Modal).
- `server/models/`: Database schemas for Medicines and Users.

---

## 🚀 How to Run the Project
1. **Open Two Terminals**:
2. **Terminal 1 (Backend)**:
   ```bash
   cd server
   npm install
   node server.js
   ```
3. **Terminal 2 (Frontend)**:
   ```bash
   cd client
   npm install
   npm run dev
   ```
4. **Login**: Use the **"Instant Demo"** button on the login page for an immediate walkthrough!

---

## 🩺 Why MedReminder?
Built for high-performance and zero-setup local privacy. MedReminder isn't just a medicine tracker; it's a complete health companion that brings professional fitness and medical guidance directly to your dashboard.
