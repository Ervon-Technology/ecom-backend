var sequelize = require('../config/db');

const User = sequelize.define('User', {
    firstName: { type: Sequelize.STRING, allowNull: false },
    lastName: { type: Sequelize.STRING, allowNull: false },
    email: {  type: Sequelize.STRING, allowNull: false, unique: true },
    number: { type: Sequelize.STRING, allowNull: false, unique: true },
    password: { type: Sequelize.STRING, allowNull: false }
});

module.exports = User;
  