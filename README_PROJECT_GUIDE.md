# 💊 MedReminder Project Guide (HTML + CSS + JavaScript + Java + SQL)

This guide explains the architecture of your Medicine Reminder application and where to go to make updates.

---

## 📁 1. Project Structure

The primary application is located in **`medreminder-java/`**:
1. **`medreminder-java/src/main/resources/static/`**: The "Face" of the app (Frontend). Built with **HTML5, CSS3, and Vanilla JavaScript**.
2. **`medreminder-java/src/main/java/com/medreminder/`**: The "Brain" of the app (Backend). Built with **Java (Spring Boot 3)**.
3. **`medreminder-java/src/main/resources/schema.sql`**: The "Memory" of the app (Database). Built with relational **SQL** (`users` and `medicines` tables).

---

## 🎨 2. How to Update the UI (Frontend)

If you need to change colors, text, or layout:

### **A. Main Dashboard & Views**
* **Files**: 
  - `medreminder-java/src/main/resources/static/index.html` (Main Dashboard)
  - `medreminder-java/src/main/resources/static/login.html` (Login & Signup)
  - `medreminder-java/src/main/resources/static/calendar.html` (Calendar View)
  - `medreminder-java/src/main/resources/static/admin.html` (Admin SQL Console)
* **What's inside**: Clean, readable HTML with cards, sidebar, and modals.

### **B. Colors, Themes & Animations**
* **File**: `medreminder-java/src/main/resources/static/css/style.css`
* **What's inside**: All CSS variables (`--primary`, `--card-bg`, `--bg-main`), glassmorphism effects, and `@keyframes` animations.
* **To Update**: Change `--primary: #6366f1;` to change the main brand color.

### **C. Frontend Logic & Reminders**
* **Files**: 
  - `medreminder-java/src/main/resources/static/js/app.js` (Dashboard rendering, audio alert chime loop, doctor chatbot)
  - `medreminder-java/src/main/resources/static/js/api.js` (Calls the Java REST API using `fetch()`)
  - `medreminder-java/src/main/resources/static/js/login.js` (Handles sign in, demo login, and token storage)

---

## 🧠 3. How to Update Logic (Backend in Java)

If you need to change backend rules or API endpoints:

### **A. REST API Endpoints**
* **Files**:
  - `medreminder-java/src/main/java/com/medreminder/controller/MedicineController.java` (Medicine CRUD, Refill)
  - `medreminder-java/src/main/java/com/medreminder/controller/AuthController.java` (Login, Register, BCrypt hashing)
  - `medreminder-java/src/main/java/com/medreminder/controller/AdminController.java` (Admin stats)

### **B. SQL Database Schema & Data Models**
* **Files**:
  - `medreminder-java/src/main/resources/schema.sql` (Raw SQL DDL)
  - `medreminder-java/src/main/java/com/medreminder/model/Medicine.java` (Medicine SQL Entity)
  - `medreminder-java/src/main/java/com/medreminder/model/User.java` (User SQL Entity)
  - `medreminder-java/src/main/java/com/medreminder/config/DataInitializer.java` (Initial demo seed data)

---

## 🛠️ 4. Common Tasks

| Task | Where to go |
| :--- | :--- |
| **Change App Name** | `medreminder-java/src/main/resources/static/index.html` |
| **Change Theme Color** | `medreminder-java/src/main/resources/static/css/style.css` (Search `--primary`) |
| **Change Alert Sound** | `medreminder-java/src/main/resources/static/assets/medicine_reminder.mp3` |
| **View Raw SQL Tables** | Open `http://localhost:8080/h2-console` in browser |
| **Switch to MySQL** | `medreminder-java/src/main/resources/application.properties` |

---

## 🚀 5. How to Run the Project
1. Open `medreminder-java/` in **VS Code** or **IntelliJ**.
2. Run `MedReminderApplication.java`.
3. Open `http://localhost:8080/` in your browser!
