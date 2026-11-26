# MedReminder - Full-Stack Health & Medication Companion 💊

[![Java](https://img.shields.io/badge/Java-25%20%7C%2017-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![SQL](https://img.shields.io/badge/SQL-MySQL%20%7C%20H2-blue.svg)](https://www.mysql.com/)
[![Frontend](https://img.shields.io/badge/Frontend-HTML5%20%7C%20CSS3%20%7C%20JavaScript-yellow.svg)](https://developer.mozilla.org/)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Online-success.svg)](https://medicine-reminder-zc9o.onrender.com)

A premium, full-stack healthcare application designed to manage medications, track real-time health metrics, and provide guided physical exercises. Built with **HTML5, CSS3, Vanilla JavaScript, Java (Spring Boot 3), and SQL**, MedReminder combines modern glassmorphism design with enterprise-grade backend security and relational database persistence.

---

## 🌟 Exhibition Highlights
- **Interactive Exercise Coach**: Features a "Do with Me" workout mode with an **animated coach**, live countdown timers, and professional step-by-step guidance.
- **Smart Health Assistant**: A friendly **animated cartoon doctor** (Dr. Med-Bot) that provides daily health tips, hydration guidance, and simulated AI insights.
- **Dynamic Health Dashboard**: Real-time tracking of **BMI**, **Daily Water Goals**, and **Calories** using persistent local storage.
- **Intelligent Reminder Engine**: Cross-platform browser notifications paired with a custom high-fidelity audio alert system (`medicine_reminder.mp3`).
- **SQL Database Console**: Interactive browser-based SQL console (`/h2-console`) to inspect and query raw relational tables directly.

---

## 🛠️ Technical Architecture (Java + SQL Full-Stack)

### **Frontend (The Face)**
- **HTML5**: Semantic, accessible markup for Dashboard, Login, Calendar, and Admin views.
- **CSS3 (Glassmorphism)**: Modern glass cards, glowing backdrops, dark/light theme switching, and smooth `@keyframes` animations.
- **Vanilla JavaScript**: Lightweight, framework-free DOM manipulation, asynchronous `fetch()` API, Web Audio API, and Notification engine.

### **Backend (The Brain)**
- **Java 17+ / Java 25**: Enterprise object-oriented backend powered by **Spring Boot 3**.
- **RESTful APIs**: Clean JSON endpoints for Authentication, Medicine CRUD, Prescription refills, and Admin analytics.
- **Spring Security & JWT**: Stateless token-based authentication with **BCrypt** password encryption.

### **Database (Storage)**
- **Relational SQL Database**: Standard SQL schemas with foreign key integrity.
- **Spring Data JPA & Hibernate**: Object-relational mapping (ORM) for fast, safe queries.
- **Dual SQL Support**: Zero-install file-persisted SQL (H2) for instant local running, plus full compatibility with **MySQL** and **PostgreSQL**.

---

## 📂 Project Structure

```text
├── medreminder-java/                             # ☕ Primary Java + SQL Application
│   ├── pom.xml                                   # Maven dependencies (Spring Boot, Security, JPA, SQL)
│   ├── src/main/resources/
│   │   ├── application.properties                # SQL connection & server port (8080)
│   │   ├── schema.sql                            # Relational SQL DDL (users, medicines)
│   │   └── static/                               # 🎨 Pure HTML, CSS & JavaScript Frontend
│   │       ├── index.html                        # Main Dashboard
│   │       ├── login.html                        # Glassmorphic Login & Register
│   │       ├── calendar.html                     # 7-Day Medication Schedule
│   │       ├── admin.html                        # Admin SQL Analytics Dashboard
│   │       ├── css/style.css                     # Handcrafted Glassmorphic Theme CSS
│   │       ├── js/                               # api.js, app.js, login.js
│   │       └── assets/                           # Doctor mascot, hero images, audio MP3
│   └── src/main/java/com/medreminder/            # Java Spring Boot Source Code
│       ├── MedReminderApplication.java           # Entry point
│       ├── controller/                           # AuthController, MedicineController, AdminController
│       ├── model/                                # User.java, Medicine.java (SQL Entities)
│       ├── repository/                           # Spring Data JPA repositories
│       └── security/                             # JWT filter, BCrypt password encoder
├── client/                                       # (Optional) React edition
└── server/                                       # (Optional) Node.js edition
```

---

## 🚀 How to Run the Java + SQL Project

### Option 1: In VS Code, IntelliJ IDEA, or Eclipse (Recommended)
1. Open the folder `medreminder-java/` in your IDE.
2. The IDE will automatically detect `pom.xml` and import dependencies.
3. Open `src/main/java/com/medreminder/MedReminderApplication.java` and click **Run** (green Play button).
4. Open your browser:
   - **App UI:** [http://localhost:8080/](http://localhost:8080/)
   - **SQL Database Console:** [http://localhost:8080/h2-console](http://localhost:8080/h2-console)

### Option 2: Using Maven in Terminal
```bash
cd medreminder-java
mvn spring-boot:run
```

---

## 🔑 Login Credentials

The SQL database is automatically seeded on first launch:
- **User Account:** `demo` / `demo123` *(pre-loaded with 4 medicines & schedule)*
  *(Or click **"⚡ Instant Demo Walkthrough"** on the login page)*
- **Admin Account:** `admin` / `adminpassword` *(to view the Admin SQL Analytics Console)*

---

## 🗄️ SQL Database Schema

```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE medicines (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    dosage VARCHAR(50) NOT NULL,
    reminder_time VARCHAR(10) NOT NULL,
    meal_type VARCHAR(50) DEFAULT 'after food',
    quantity INT DEFAULT 0,
    total_quantity INT DEFAULT 0,
    doctor_email VARCHAR(100),
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 🩺 Why MedReminder?
Built for high-performance and zero-setup local privacy. MedReminder isn't just a medicine tracker; it's a complete health companion that brings professional fitness and medical guidance directly to your dashboard.
