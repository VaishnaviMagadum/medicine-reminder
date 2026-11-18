const Medicine = require('../models/Medicine');
const User = require('../models/User');
const { sendAutoEmail, sendLowStockEmail } = require('../utils/mailer');

exports.createMedicine = async (req, res) => {
  try {
    const { name, dosage, reminderTime, mealType, quantity, totalQuantity, doctorEmail, startDate, endDate } = req.body;
    
    console.log('Attempting to create medicine with:', { name, dosage, userId: req.user });

    const medicine = await Medicine.create({ 
      name, 
      dosage, 
      reminderTime, 
      mealType: mealType || 'after food', 
      quantity: parseInt(quantity) || 0, 
      totalQuantity: parseInt(totalQuantity) || 0, 
      doctorEmail, 
      startDate, 
      endDate,
      userId: req.user 
    });
    
    res.json(medicine);
  } catch (err) {
    console.error('CREATE MEDICINE ERROR:', err);
    res.status(500).json({ 
      msg: 'Server error', 
      error: err.message,
      stack: err.stack 
    });
  }
};

exports.getMedicines = async (req, res) => {
  try {
    console.log(`FETCHING MEDICINES FOR USER: ${req.user} (${typeof req.user})`);
    const medicines = await Medicine.findAll({ 
      where: { userId: Number(req.user) },
      order: [['createdAt', 'DESC']]
    });
    console.log(`FOUND ${medicines.length} MEDICINES`);
    res.json(medicines);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findByPk(req.params.id);
    if (!medicine || medicine.userId !== Number(req.user)) {
      return res.status(404).json({ msg: 'Medicine not found' });
    }
    res.json(medicine);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.updateMedicine = async (req, res) => {
  try {
    const medId = req.params.id;
    const reqUser = req.user;
    
    console.log(`--- UPDATE DEBUG START ---`);
    console.log(`Request Med ID: ${medId}`);
    console.log(`Request User ID (raw): ${reqUser} (${typeof reqUser})`);
    
    let medicine = await Medicine.findByPk(medId);
    
    if (!medicine) {
      console.warn(`DATABASE ERROR: Medicine with ID ${medId} not found in DB.`);
      return res.status(404).json({ msg: 'Medicine not found in database' });
    }
    
    console.log(`Found Medicine: ${medicine.name}`);
    console.log(`Medicine Owner ID: ${medicine.userId} (${typeof medicine.userId})`);
    
    if (Number(medicine.userId) !== Number(reqUser)) {
      console.warn(`AUTH MISMATCH: Med owner ${medicine.userId} does not match Req user ${reqUser}`);
      return res.status(404).json({ msg: `Medicine not found (Owner mismatch: ${medicine.userId} vs ${reqUser})` });
    }
    
    const oldQuantity = medicine.quantity;
    await medicine.update(req.body);
    console.log(`SUCCESS: Updated ${medicine.name} quantity to ${medicine.quantity}`);
    console.log(`--- UPDATE DEBUG END ---`);
    
    // Send Low Stock Alert if it just hit the threshold (or is still low)
    if (medicine.quantity <= 5 && req.body.quantity !== undefined && oldQuantity > 5) {
      const user = await User.findByPk(medicine.userId);
      sendLowStockEmail(user?.username || 'Patient', medicine.name, medicine.quantity, medicine.doctorEmail);
    }

    res.json(medicine);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByPk(req.params.id);
    if (!medicine || medicine.userId !== Number(req.user)) {
      return res.status(404).json({ msg: 'Medicine not found' });
    }
    await medicine.destroy();
    res.json({ msg: 'Medicine removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
