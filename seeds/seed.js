const sequelize = require('../config/connection');
const { User , Task, NotTask, CompletedTask, Stats} = require('../models');

const userData = require('./userData.json');
const completedTaskData = require('./completedTaskData.json');
const taskData = require('./taskData.json');
const statsData = require('./statsData.json');
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

  await CompletedTask.bulkCreate(completedTaskData, {
    individualHooks: true,
    returning: true,
  });

  await Stats.bulkCreate(statsData, {
    individualHooks: true,
    returning: true,
  });

  process.exit(0);
};

seedDatabase();
