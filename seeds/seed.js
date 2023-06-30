const sequelize = require('../config/connection');
const { User } = require('../models');
const { Task } = require('../models');
const { NotTask } = require('../models');

const userData = require('./userData.json');
const taskData = require('./taskData.json');
const notTaskData = require('./notTaskData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

   await Task.bulkCreate(taskData, {
    individualHooks: true,
    returning: true,
   });
  
  await NotTask.bulkCreate(notTaskData, {
    individualHooks: true,
    returning: true,
  });

  process.exit(0);
};

seedDatabase();
