const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Task extends Model {}

Task.init(
  {
    title: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.TEXT
    },
    priority: {
      type: DataTypes.INTEGER
    },
    due_date: {
      type: DataTypes.DATE // or DATEONLY if you don't want time.  Might be easier to have a default time if a user doesn't import one
    },
  },
  {
    sequelize,
    timestamps: false,
    underscored: true,
    modelName: 'task'
  }
);

module.exports = Task;
