const { sequelize } = require('./config/db');
const Medicine = require('./models/Medicine');
const User = require('./models/User');

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');

    // 1. Get/Create a real user
    let realUser = await User.findOne({ order: [['createdAt', 'DESC']] });
    if (!realUser) {
      console.log('No user found. Creating default user: testuser');
      realUser = await User.create({
        username: 'testuser',
        password: 'password123'
      });
    }

    const userIds = [realUser.id, 999]; // Real user and Demo user

    for (const userId of userIds) {
      console.log(`Seeding data for User ID: ${userId}`);
      
      const medicines = [
        {
          name: 'Amoxicillin',
          dosage: '500mg',
          reminderTime: '08:00',
          mealType: 'after food',
          quantity: 12,
          totalQuantity: 30,
          doctorEmail: 'dr.smith@example.com',
          userId: userId
        },
        {
          name: 'Lisinopril',
          dosage: '10mg',
          reminderTime: '12:00',
          mealType: 'before food',
          quantity: 25,
          totalQuantity: 30,
          doctorEmail: 'dr.jones@example.com',
          userId: userId
        },
        {
          name: 'Metformin',
          dosage: '500mg',
          reminderTime: '20:00',
          mealType: 'after food',
          quantity: 4,
          totalQuantity: 60,
          doctorEmail: 'dr.taylor@example.com',
          userId: userId
        },
        {
          name: 'Atorvastatin',
          dosage: '20mg',
          reminderTime: '22:00',
          mealType: 'after food',
          quantity: 28,
          totalQuantity: 30,
          doctorEmail: 'dr.white@example.com',
          userId: userId
        },
        {
          name: 'Vitamin D3',
          dosage: '2000 IU',
          reminderTime: '09:30',
          mealType: 'after food',
          quantity: 50,
          totalQuantity: 100,
          doctorEmail: 'general@clinic.com',
          userId: userId
        },
        {
          name: 'Ibuprofen',
          dosage: '200mg',
          reminderTime: '14:00',
          mealType: 'before food',
          quantity: 10,
          totalQuantity: 30,
          doctorEmail: 'dr.smith@example.com',
          userId: userId
        },
        {
          name: 'Cetirizine',
          dosage: '10mg',
          reminderTime: '21:00',
          mealType: 'after food',
          quantity: 3,
          totalQuantity: 10,
          doctorEmail: 'dr.taylor@example.com',
          userId: userId
        },
        {
          name: 'Omega-3',
          dosage: '1000mg',
          reminderTime: '08:30',
          mealType: 'after food',
          quantity: 45,
          totalQuantity: 60,
          doctorEmail: 'general@clinic.com',
          userId: userId
        }
      ];

      for (const med of medicines) {
        await Medicine.create(med);
        console.log(`Added ${med.name} to User ${userId}`);
      }
    }

    console.log('Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seed();
