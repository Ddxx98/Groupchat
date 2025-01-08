const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const User = require('./user');
const Groups = require('./groups');

const Chats = sequelize.define('chat', {
    message: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    sender: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    groupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    type: {
        type: Sequelize.STRING,
        allowNull: false,
    }
});

Chats.belongsTo(Groups, { foreignKey: 'groupId', as: 'group' });
Groups.hasMany(Chats, { foreignKey: 'groupId', as: 'chats' });

Chats.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Chats, { foreignKey: 'userId', as: 'chats' });

module.exports = Chats;