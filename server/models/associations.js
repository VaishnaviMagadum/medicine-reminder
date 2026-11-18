const User = require('./User');
const Medicine = require('./Medicine');

User.hasMany(Medicine, { foreignKey: 'userId' });
Medicine.belongsTo(User, { foreignKey: 'userId' });

module.exports = { User, Medicine };
