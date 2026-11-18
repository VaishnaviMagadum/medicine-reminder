const { sequelize } = require('./config/db');
const Medicine = require('./models/Medicine');
const User = require('./models/User');

async function dumpAll() {
  try {
    await sequelize.authenticate();
    const users = await User.findAll();
    const medicines = await Medicine.findAll();
    
    console.log('--- USERS ---');
    users.forEach(u => console.log(`ID: ${u.id}, Username: ${u.username}`));
    
    console.log('\n--- MEDICINES ---');
    medicines.forEach(m => console.log(`ID: ${m.id}, Name: ${m.name}, UserID: ${m.userId}`));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

dumpAll();
