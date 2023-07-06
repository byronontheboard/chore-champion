const User = require('./User');
const Task = require('./Task');
const CompletedTask = require('./CompletedTask');

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

module.exports = {
    User,
    Task,
    CompletedTask
};
