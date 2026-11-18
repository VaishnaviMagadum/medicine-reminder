const express = require('express');
const router = express.Router();
const { getStats, getAllUsers, getAllMedicines } = require('../controllers/adminController');
const auth = require('../middleware/auth');

// Middleware to check if user is admin
const adminOnly = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ msg: 'Access denied. Admins only.' });
  }
  next();
};

router.get('/stats', auth, adminOnly, getStats);
router.get('/users', auth, adminOnly, getAllUsers);
router.get('/medicines', auth, adminOnly, getAllMedicines);

module.exports = router;
