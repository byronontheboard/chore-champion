const User = require('./User');
const Task = require('./Task');
const NotTask = require('./NotTask');

Task.belongsTo(User, {
    foreignKey: 'user_id'
});

User.hasMany(Task, {
    foreignKey: 'user_id'
});

User.hasMany(NotTask, {
    foreignKey: 'user_id'
});

module.exports = {
    User,
    Task,
    NotTask
};
