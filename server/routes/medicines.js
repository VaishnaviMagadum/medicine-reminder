const express = require('express');
const router = express.Router();
const { createMedicine, getMedicines, getMedicineById, updateMedicine, deleteMedicine } = require('../controllers/medicineController');
const auth = require('../middleware/auth');
const { sendAutoEmail } = require('../utils/mailer');
const Medicine = require('../models/Medicine');

router.post('/', auth, createMedicine);
router.get('/', auth, getMedicines);
router.get('/:id', auth, getMedicineById);
router.put('/:id', auth, updateMedicine);
router.delete('/:id', auth, deleteMedicine);

// Endpoint to manually trigger an alert
router.post('/alert/:id', auth, async (req, res) => {
  try {
    const medicine = await Medicine.findByPk(req.params.id);
    if (!medicine) return res.status(404).json({ msg: 'Medicine not found' });
    
    // In a real scenario, we'd get the user name from req.user
    const result = await sendAutoEmail('Patient', medicine.name, medicine.doctorEmail);
    res.json({ msg: 'Alert sent successfully', success: result });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
