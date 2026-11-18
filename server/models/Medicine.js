const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Medicine = sequelize.define('Medicine', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dosage: {
    type: DataTypes.STRING,
    allowNull: false
  },
  reminderTime: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mealType: {
    type: DataTypes.STRING,
    defaultValue: 'after food'
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  doctorEmail: {
    type: DataTypes.STRING,
    allowNull: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 10 // Current pills left
  },
  totalQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 30 // Total pills in bottle
  },
  startDate: {
    type: DataTypes.STRING,
    allowNull: true
  },
  endDate: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Medicine;
