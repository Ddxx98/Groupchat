const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const User = require('./user');

const Groups = sequelize.define('groups', {
    groupName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    creatorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
});

Groups.belongsToMany(User, {
    through: 'GroupUser',
    foreignKey: 'groupId',
    otherKey: 'userId',
    as: 'members',
});

User.belongsToMany(Groups, {
    through: 'GroupUser',
    foreignKey: 'userId',
    otherKey: 'groupId',
    as: 'groups',
});

module.exports = Groups;