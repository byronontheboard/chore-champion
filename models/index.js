const User = require('./User');
const Task = require('./Task');
const Stats = require('./Stats');

Task.belongsTo(User, {
    foreignKey: 'user_id'
});

User.hasMany(Task, {
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
    Stats
};
