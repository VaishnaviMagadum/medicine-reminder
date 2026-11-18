require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const User = require('./models/User');
const Medicine = require('./models/Medicine');

// Define associations before connecting/syncing
require('./models/associations');

const seedInitialDataIfEmpty = async () => {
  try {
    const userCount = await User.count();
    if (userCount > 0) return;

    const demoUser = await User.create({
      username: 'demo',
      password: 'demo123',
      role: 'user'
    });

    await User.create({
      username: 'admin',
      password: 'adminpassword',
      role: 'admin'
    });

    await Medicine.bulkCreate([
      {
        name: 'Amoxicillin',
        dosage: '500mg',
        reminderTime: '08:00',
        mealType: 'after food',
        quantity: 12,
        totalQuantity: 30,
        doctorEmail: 'dr.smith@example.com',
        userId: demoUser.id
      },
      {
        name: 'Lisinopril',
        dosage: '10mg',
        reminderTime: '12:00',
        mealType: 'before food',
        quantity: 25,
        totalQuantity: 30,
        doctorEmail: 'dr.jones@example.com',
        userId: demoUser.id
      },
      {
        name: 'Metformin',
        dosage: '500mg',
        reminderTime: '20:00',
        mealType: 'after food',
        quantity: 4,
        totalQuantity: 60,
        doctorEmail: 'dr.taylor@example.com',
        userId: demoUser.id
      },
      {
        name: 'Vitamin D3',
        dosage: '2000 IU',
        reminderTime: '09:30',
        mealType: 'after food',
        quantity: 50,
        totalQuantity: 100,
        doctorEmail: 'general@clinic.com',
        userId: demoUser.id
      }
    ]);

    console.log('Seeded initial demo and admin accounts');
  } catch (err) {
    console.error('Error seeding initial data:', err);
  }
};

const app = express();

// Versioned health check to verify code updates
app.get('/api/health', (req, res) => res.json({ status: 'ok', version: '2.0-debug' }));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/medicines', require('./routes/medicines'));
app.use('/api/admin', require('./routes/admin'));

// Serve built React frontend in production
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 10000;

connectDB().then(async () => {
  await seedInitialDataIfEmpty();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
});
