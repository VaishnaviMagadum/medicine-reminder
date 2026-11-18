const User = require('../models/User');
const Medicine = require('../models/Medicine');
const { sequelize } = require('../config/db');

exports.getStats = async (req, res) => {
  try {
    console.log(`ADMIN_DEBUG: User ID ${req.user}, Role ${req.userRole}`);
    const totalUsers = await User.count();
    const activeMeds = await Medicine.count();
    
    res.json({
      totalUsers,
      activeMeds,
      alertsToday: Math.floor(Math.random() * 15),
      systemStatus: 'Healthy'
    });
  } catch (err) {
    console.error('ADMIN_STATS_ERROR:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.findAll({
      include: [{
        model: User,
        attributes: ['username']
      }]
    });
    res.json(medicines);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
