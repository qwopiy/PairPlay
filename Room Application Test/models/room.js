const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Room = sequelize.define('Room', {
  roomId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  maxPlayers: {
    type: DataTypes.INTEGER,
    defaultValue: 2
  }
});

module.exports = Room;