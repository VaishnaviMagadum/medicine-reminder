const { connectDB } = require('./config/db');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    await connectDB();
    
    const adminUsername = 'admin';
    const adminPassword = 'adminpassword'; // In a real app, use a strong password
    
    let admin = await User.findOne({ where: { username: adminUsername } });
    
    if (admin) {
      console.log('Admin user already exists. Updating role to admin...');
      admin.role = 'admin';
      await admin.save();
    } else {
      console.log('Creating new admin user...');
      admin = await User.create({
        username: adminUsername,
        password: adminPassword,
        role: 'admin'
      });
    }
    
    console.log('Admin user seeded successfully:');
    console.log(`Username: ${adminUsername}`);
    console.log(`Password: ${adminPassword}`);
    console.log(`Role: ${admin.role}`);
    
    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin:', err);
    process.exit(1);
  }
};

seedAdmin();
