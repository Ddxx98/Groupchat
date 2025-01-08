const Chats = require('../models/chats')
const User = require('../models/user')
const groupUser = require('../models/groupUser')
const { Op } = require('sequelize')

exports.addChats = async (req, res, next) => {
    const message = req.body.message
    const sender = req.user.name
    const userId = req.user.id
    const groupId = req.body.groupId
    try{
        const User = await groupUser.findOne({ where: { groupId: groupId, userId: userId } })
        if(!User) {
            return res.status(404).json({ message: "User is not a member of the group" })
        }
        const chat = await Chats.create({ message: message, sender: sender, userId: userId, groupId: groupId })
        res.status(201).json({ message: "Chat added", chatId: chat.id })
    } catch(err) {
        console.log(err)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.getChats = async (req, res, next) => {
    try{
        const chats = await Chats.findAll()
        res.status(200).json({ message: "Chats fetched", chats: chats })
    } catch(err) {
        res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.getLastChat = async (req, res, next) => {
    const lastMessageId = parseInt(req.query.lastMessageId) || 0;
    try{
        const chats = await Chats.findAll({ where: { id: { [Op.gt]: lastMessageId } } })
        res.status(200).json({ message: "Chats fetched", chats: chats })
    } catch(err) {
        console.log(err)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.getGroupChat = async (req, res ) => {
    const groupId = req.query.groupId
    try{
        const chats = await Chats.findAll({ where: { groupId: groupId } })
        res.status(200).json({ message: "Chats fetched", chats: chats })
    } catch(err) {
        console.log(err)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.getAllUsers = async (req, res, next) => {
    try{
        const users = await User.findAll()
        res.status(200).json({ message: "Users fetched", users: users })
    } catch(err) {
        console.log(err)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.socketAddChat = async (message, sender, userId, groupId) => {
    try{
        const chat = await Chats.create({ message: message, sender: sender, userId: userId, groupId: groupId })
        if(!chat) {
            return "User is not a member of the group"
        }
        return chat
    } catch(err) {
        return err
    }
}