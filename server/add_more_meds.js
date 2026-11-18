const { sequelize } = require('./config/db');
const Medicine = require('./models/Medicine');
const User = require('./models/User');

async function addFullStockMeds() {
  try {
    await sequelize.authenticate();
    const user = await User.findOne({ order: [['createdAt', 'DESC']] });
    if (!user) {
      console.log('No user found.');
      process.exit(1);
    }

    const meds = [
      {
        name: 'Paracetamol',
        dosage: '650mg',
        reminderTime: '10:00',
        mealType: 'after food',
        quantity: 50,
        totalQuantity: 50,
        doctorEmail: 'dr.puneet@health.com',
        userId: user.id
      },
      {
        name: 'Aspirin',
        dosage: '81mg',
        reminderTime: '07:00',
        mealType: 'before food',
        quantity: 30,
        totalQuantity: 30,
        doctorEmail: 'cardio@clinic.com',
        userId: user.id
      },
      {
        name: 'Multivitamin',
        dosage: '1 Tablet',
        reminderTime: '09:00',
        mealType: 'after food',
        quantity: 90,
        totalQuantity: 90,
        doctorEmail: 'general@care.com',
        userId: user.id
      }
    ];

    for (const med of meds) {
      await Medicine.create(med);
      console.log(`Added ${med.name} with full stock.`);
    }

    console.log('Done!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

addFullStockMeds();
