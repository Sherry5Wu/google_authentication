const path = require('path');
const { Sequelize } = require('sequelize');

const dbPath = process.env.DB_PATH || path.resolve(__dirname, '../../data/database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false
});

const initDB = async () => {
  // import models
  const User = require('./models/user')(sequelize);
  await sequelize.authenticate();
  await sequelize.sync(); // sync models; for prod consider migrations
  return { sequelize, models: { User } };
};

module.exports = { sequelize, initDB };
