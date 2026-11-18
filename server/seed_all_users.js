const { sequelize } = require('./config/db');
const Medicine = require('./models/Medicine');
const User = require('./models/User');

async function seedAllUsers() {
  try {
    await sequelize.authenticate();
    const users = await User.findAll();
    
    if (users.length === 0) {
      console.log('No users found.');
      process.exit(0);
    }

    const medsToAdd = [
      { name: 'Paracetamol', dosage: '650mg', reminderTime: '10:00', mealType: 'after food', quantity: 50, totalQuantity: 50, doctorEmail: 'dr.puneet@health.com' },
      { name: 'Aspirin', dosage: '81mg', reminderTime: '07:00', mealType: 'before food', quantity: 30, totalQuantity: 30, doctorEmail: 'cardio@clinic.com' },
      { name: 'Multivitamin', dosage: '1 Tablet', reminderTime: '09:00', mealType: 'after food', quantity: 90, totalQuantity: 90, doctorEmail: 'general@care.com' },
      { name: 'Metformin', dosage: '500mg', reminderTime: '20:00', mealType: 'after food', quantity: 4, totalQuantity: 60, doctorEmail: 'dr.taylor@example.com' },
      { name: 'Cetirizine', dosage: '10mg', reminderTime: '21:00', mealType: 'after food', quantity: 3, totalQuantity: 10, doctorEmail: 'dr.taylor@example.com' }
    ];

    for (const user of users) {
      console.log(`Seeding for user: ${user.username} (ID: ${user.id})`);
      for (const med of medsToAdd) {
        await Medicine.create({ ...med, userId: user.id });
      }
    }

    console.log('Seeding complete for all users!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedAllUsers();
