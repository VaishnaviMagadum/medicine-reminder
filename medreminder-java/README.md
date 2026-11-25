# 💊 MedReminder (Java + SQL Full-Stack Edition)

This is the **Java + SQL** version of MedReminder, featuring:
- **Backend:** Java 17+ with **Spring Boot 3** (REST Controllers, Spring Security, JWT, Spring Data JPA).
- **Database (SQL):** Standard Relational SQL schema with foreign keys, supported out-of-the-box via **file-persisted SQL (H2)** or **MySQL**.
- **Frontend (Exact Same UI):** 100% pixel-perfect identical UI (glassmorphism cards, animated health coach doctor, exercise modal, audio chime alerts, and interactive dashboard) served directly by Spring Boot on port `8080`.

---

## 📁 Project Architecture

```text
medreminder-java/
├── pom.xml                                      # Maven configuration & dependencies
├── src/main/resources/
│   ├── application.properties                   # Database & server configuration
│   ├── schema.sql                               # Standard SQL CREATE TABLE statements
│   └── static/                                  # Exact same UI (HTML, CSS, JS, Images, Audio)
│       ├── index.html                           # Single-page dashboard & login
│       ├── favicon.svg
│       └── assets/                              # Compiled CSS, JS, cartoon doctor, MP3 audio
└── src/main/java/com/medreminder/
    ├── MedReminderApplication.java              # Main Spring Boot Application
    ├── config/
    │   └── DataInitializer.java                 # Auto-seeds demo & admin users on startup
    ├── controller/
    │   ├── AuthController.java                  # /api/auth/login, /api/auth/register, /api/health
    │   ├── MedicineController.java              # /api/medicines (CRUD, alerts)
    │   ├── AdminController.java                 # /api/admin/stats, /users, /medicines
    │   └── SpaController.java                   # Client-side router forwarder
    ├── dto/                                     # Request & Response Data Transfer Objects
    ├── model/
    │   ├── User.java                            # SQL User entity table
    │   └── Medicine.java                        # SQL Medicine entity table
    ├── repository/
    │   ├── UserRepository.java                  # Spring Data JPA repository
    │   └── MedicineRepository.java              # Spring Data JPA repository
    └── security/
        ├── JwtUtil.java                         # JWT generator & token parser
        ├── JwtAuthenticationFilter.java         # Spring security request filter
        └── SecurityConfig.java                  # BCrypt, CORS, & stateless security filter
```

---

## 🗄️ SQL Database Tables

The database uses standard relational SQL:

### 1. `users` Table
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. `medicines` Table
```sql
CREATE TABLE medicines (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    dosage VARCHAR(50) NOT NULL,
    reminder_time VARCHAR(10) NOT NULL,
    meal_type VARCHAR(50) DEFAULT 'after food',
    quantity INT DEFAULT 0,
    total_quantity INT DEFAULT 0,
    doctor_email VARCHAR(100),
    start_date VARCHAR(50),
    end_date VARCHAR(50),
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 🚀 How to Run the Project

### Option A: In IntelliJ IDEA, Eclipse, or VS Code (Recommended)
1. Open this `medreminder-java` folder in **IntelliJ IDEA**, **Eclipse**, or **VS Code**.
2. Maven will automatically import the dependencies from `pom.xml`.
3. Locate `src/main/java/com/medreminder/MedReminderApplication.java`.
4. Right-click and choose **Run 'MedReminderApplication'** (or press the green Play button).
5. Open your browser and go to:
   - **Live App UI:** http://localhost:8080/
   - **H2 SQL Console:** http://localhost:8080/h2-console

### Option B: Using Maven in Terminal
```bash
mvn clean spring-boot:run
```

---

## 🔑 Pre-seeded Login Credentials

The application automatically seeds initial data if the database is fresh:
- **User Account:** Username `demo` | Password `demo123` *(pre-loaded with 4 medicines)*
- **Admin Account:** Username `admin` | Password `adminpassword`

---

## 🛠️ Viewing Raw SQL Queries in Browser (H2 Console)
1. Open http://localhost:8080/h2-console
2. Make sure the **JDBC URL** is:
   ```text
   jdbc:h2:file:./data/medreminder
   ```
3. Username: `sa` | Password: *(leave blank)*
4. Click **Connect** to write and run raw SQL queries directly (`SELECT * FROM MEDICINES;`)!

---

## 🐬 Switching to MySQL (Optional)
If you want to use MySQL instead of the built-in file-based SQL database:
1. Open `src/main/resources/application.properties`.
2. Comment out the H2 lines and uncomment the MySQL lines:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/medreminder?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   spring.datasource.driverClassName=com.mysql.cj.jdbc.Driver
   spring.datasource.username=root
   spring.datasource.password=YOUR_PASSWORD
   spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
   ```
3. Create the database in MySQL:
   ```sql
   CREATE DATABASE medreminder;
   ```
Spring Boot will automatically generate the tables and seed demo data on first start.

