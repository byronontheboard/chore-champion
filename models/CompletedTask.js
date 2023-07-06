const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const User = require('./User');
const Task = require('./Task');

class CompletedTask extends Model {}

CompletedTask.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
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
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    task_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Task,
        key: 'id'
      }
    },
  },
  {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'task',
  }
);

module.exports = Task;
