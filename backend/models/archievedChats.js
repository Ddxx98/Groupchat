const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const ArchievedChats = sequelize.define('archievedChats', {
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

module.exports = ArchievedChats;