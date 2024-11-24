const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('Database_Pemain_PairPlay', 'postgres', 'WakIzul99', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;