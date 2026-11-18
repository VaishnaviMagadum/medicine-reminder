const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: false }); // Disable alter to avoid SQLite migration issues
    console.log('SQLite Database Connected & Synced');
  } catch (err) {
    console.error('Unable to connect to the SQLite database:', err);
  }
};

module.exports = { sequelize, connectDB };
