const User = require('./User');
const Task = require('./Task');
const CompletedTask = require('./CompletedTask');
const Stats = require('./Stats');
const NotTask = require('./NotTask');

Task.belongsTo(User, {
    foreignKey: 'user_id'
});

User.hasMany(Task, {
    foreignKey: 'user_id',
});

User.hasMany(CompletedTask, {
    foreignKey: 'user_id',
});

Task.hasOne(CompletedTask, {
    foreignKey: 'task_id',
});

CompletedTask.belongsTo(Task, {
    foreignKey: 'task_id',
});

CompletedTask.belongsTo(User, {
    foreignKey: 'user_id',
});

User.hasMany(NotTask, {
    foreignKey: 'user_id'
});

Stats.belongsTo(User, {
    foreignKey: 'user_id'
});

// Or should this be hasOne?  We can be flexible on what we want the Stats table to be.
User.hasMany(Stats, {
    foreignKey: 'user_id'
});

// Hooks for toggling complete_date, integrating with Stats model and CompletedTask model
Task.afterUpdate(async (task, options) => {
    // Set to complete
    if (task.complete_date !== null && task.previous('complete_date') === null) {
        
      // Update Stats
      try {
        const statsData = await Stats.findOne({
          where: {
            user_id: task.user_id,
          },
        });

        if (!statsData) {
            // Create new Stats row if it doesn't exist, just in case
            statsData = await Stats.create({
              user_id: task.user_id,
            });
          }
        let total_points = statsData.total_points + task.points;
        statsData.total_points = total_points;
  
        await statsData.save();
        // create new CompletedTask row
        try {
            await CompletedTask.create({
            task_id: task.id,
            complete_date: task.complete_date,
            cumulative_points: total_points,
            
            // Set other completed task values based on the task if needed
            });
        } catch (error) {
            console.error('Error creating CompletedTask:', error);
        }
      } catch (error) {
        console.error('Error updating Stats:', error);
      }
      

    } else if (task.complete_date === null && task.previous('complete_date') !== null) {
        // set to incomplete
        // delete corresponding CompletedTask row
      try {
        await CompletedTask.destroy({
          where: { task_id: task.id },
        });
      } catch (error) {
        console.error('Error deleting CompletedTask:', error);
      }

      // Update Stats
      try {
        const statsData = await Stats.findOne({
          where: {
            user_id: task.user_id,
          },
        });

        if (!statsData) {
            // Create new Stats row if it doesn't exist, just in case
            statsData = await Stats.create({
              user_id: task.user_id,
            });
          }
  
        statsData.total_points -= task.points;
  
        await statsData.save();
      } catch (error) {
        console.error('Error updating Stats:', error);
      }
    }
})


// Hook to create Stats row when a new User is created
User.afterCreate(async (user, options) => {
    try {
      await Stats.create({
        user_id: user.id,
      });
    } catch (error) {
      console.error('Error creating Stats:', error);
    }
  });

module.exports = {
    User,
    Task,
    CompletedTask,
    Stats,
    NotTask
};
