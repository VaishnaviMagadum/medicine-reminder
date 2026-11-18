const { sequelize } = require('./config/db');
const Medicine = require('./models/Medicine');
const User = require('./models/User');

async function debug() {
  try {
    await sequelize.authenticate();
    const meds = await Medicine.findAll({ limit: 10, order: [['createdAt', 'DESC']] });
    console.log('LATEST_MEDS:');
    console.log(JSON.stringify(meds.map(m => ({id: m.id, name: m.name, userId: m.userId})), null, 2));
    
    const users = await User.findAll();
    console.log('ALL_USERS:');
    console.log(JSON.stringify(users.map(u => ({id: u.id, username: u.username})), null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

debug();
