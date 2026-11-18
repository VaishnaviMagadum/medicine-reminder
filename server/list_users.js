const { sequelize } = require('./config/db');
const User = require('./models/User');

async function listUsers() {
  try {
    await sequelize.authenticate();
    const users = await User.findAll();
    console.log('USERS_IN_DB:');
    users.forEach(u => console.log(`ID: ${u.id}, Username: ${u.username}, Role: ${u.role}`));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

listUsers();
