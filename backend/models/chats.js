const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Chats = sequelize.define('chats', {
    message: {
        type: Sequelize.STRING,
        allowNull: false
    },
    sender: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Chats;