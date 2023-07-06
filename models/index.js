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

module.exports = {
    User,
    Task,
    CompletedTask,
    Stats,
    NotTask
};
