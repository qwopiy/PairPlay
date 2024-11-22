const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RoomPlayer = sequelize.define('RoomPlayer', {
  roomId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false
});

module.exports = RoomPlayer;