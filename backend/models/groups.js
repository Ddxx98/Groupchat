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

module.exports = Groups;