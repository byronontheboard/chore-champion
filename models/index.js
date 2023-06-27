const User = require('./User');
const Task = require('./Task');

Task.belongsTo(User, {
    foreignKey: 'user_id'
});

User.hasMany(Task, {
    foreignKey: 'user_id'
});

module.exports = {
    User,
    Task
};
