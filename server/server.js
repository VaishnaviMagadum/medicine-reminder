require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

// Define associations before connecting/syncing
require('./models/associations');

// Connect to Database (SQLite)
connectDB();

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

const PORT = process.env.PORT || 10000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
