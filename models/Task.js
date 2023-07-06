const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const User = require('./User');
const CompletedTask = require('./CompletedTask');

class Task extends Model {}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    due_date: {
      type: DataTypes.DATE // or DATEONLY if you don't want time.  Might be easier to have a default time if a user doesn't import one. Would that be in hooks?
    },
    priority: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    complete_date: {
      type: DataTypes.DATE, // value is null if incomplete
      allowNull: true,
    },
    is_complete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      set(value) {
        // When setting the value of 'is_complete', check if 'complete_date' is null
        // and update 'is_complete' accordingly
        if (this.complete_date === null) {
          this.setDataValue('is_complete', false);
        } else {
          this.setDataValue('is_complete', true);
        }
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
  },
  {
    hooks: {
      afterUpdate: async (task, options) => {
        if (task.complete_date !== null && task.previous('complete_date') === null) {
          try {
            await CompletedTask.create({
              task_id: task.id,
              complete_date: task.complete_date,
              // Set other completed task values based on the task if needed
            });
          } catch (error) {
            console.error('Error creating CompletedTask:', error);
          }
        } else if (task.complete_date === null && task.previous('complete_date') !== null) {
          try {
            await CompletedTask.destroy({
              where: { task_id: task.id },
            });
          } catch (error) {
            console.error('Error deleting CompletedTask:', error);
          }
        }
      },
    },
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'task',
  }
);

module.exports = Task;
