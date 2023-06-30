const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const User = require('./User');

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
    points: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    minutes: {
      type: DataTypes.INTEGER,
    },
    complete_date: {
      type: DataTypes.DATE,
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
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'task',
  }
);

module.exports = Task;
