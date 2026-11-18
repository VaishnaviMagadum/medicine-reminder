# 💊 MedReminder Project Guide

This guide explains the structure of your Medicine Reminder application and where to go to make updates.

---

## 📁 1. Project Structure

The project is split into two main parts:
1.  **`client/`**: The "Face" of the app (Frontend). Built with React.
2.  **`server/`**: The "Brain" of the app (Backend). Built with Node.js and SQLite.

---

## 🎨 2. How to Update the UI (Frontend)

If you need to change colors, buttons, or add new sections:

### **A. Main Dashboard & Layout**
*   **File**: `client/src/pages/Dashboard.jsx`
*   **What's inside**: This is the heart of the UI. It contains the sidebar, the top bar, the healthcare cards, and the medicine list.
*   **To Update**: Look for the `renderContent` function. This is where the home screen, inventory, and reports are defined.

### **B. Colors & Dark Mode**
*   **File**: `client/src/index.css`
*   **What's inside**: All theme colors (variables like `--primary`, `--bg-main`).
*   **To Update**: If you want to change the "Purple" theme to "Blue", change the `--primary` variable at the top of this file.

### **C. Images & Icons**
*   **Icons**: We use **Lucide React**. You can find them at the top of `Dashboard.jsx`.
*   **Images**: Stored in `client/src/assets/`.

---

## 🧠 3. How to Update Logic (Backend)

If you need to change how medicines are saved or how alerts work:

### **A. The "Medicine" Logic**
*   **File**: `server/controllers/medicineController.js`
*   **What's inside**: This is where we handle adding, deleting, and updating stock (the "Refill" logic).
*   **To Update**: If you want to change the "Low Stock" threshold from 5 to 10, update the logic in this file.

### **B. The Database (Storage)**
*   **File**: `server/models/Medicine.js`
*   **What's inside**: The list of information we store for each medicine (Name, Dosage, Time, etc.).
*   **To Update**: If your teacher says "Add a field for Doctor Name", you would add it here first.

---

## 🛠️ 4. Common Tasks

| Task | Where to go |
| :--- | :--- |
| **Change Project Name** | `client/src/pages/Dashboard.jsx` (Search for "MedReminder") |
| **Add a New Button** | `client/src/pages/Dashboard.jsx` (Look for "Quick Actions" section) |
| **Change Alert Sound** | `client/public/assets/medicine_reminder.mp3` (Replace the file) |
| **Update Initial Data** | `server/seed_data.js` (Run `node server/seed_data.js` after editing) |

---

## 🚀 5. How to Run the Project
1.  **Start Backend**: Go to `server/` and run `node server.js`.
2.  **Start Frontend**: Go to `client/` and run `npm run dev`.

**Need help?** Just ask the AI to "Add a new field to the medicine" or "Change the theme color to blue" and I will handle it for you!
