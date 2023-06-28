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
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    priority: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    minutes: {
      type: DataTypes.INTEGER,
    },
    due_date: {
      type: DataTypes.DATE // or DATEONLY if you don't want time.  Might be easier to have a default time if a user doesn't import one
    },
    complete_date: {
      type: DataTypes.DATE,
    },
  },
  {
    // hooks: {
    //   beforeCreate: async (newUserData) => {
    //     newUserData.password = await bcrypt.hash(newUserData.password, 10);
    //     return newUserData;
    //   },
    // },
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'task',
  }
);

module.exports = Task;
