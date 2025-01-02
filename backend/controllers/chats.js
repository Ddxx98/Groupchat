const Chats = require('../models/chats')

exports.addChats = async (req, res, next) => {
    const message = req.body.message
    const sender = req.user.name
    const receiver = req.body.receiver
    const userId = req.user.id
    try{
        const chat = await Chats.create({ message: message, sender: sender, receiver: receiver, userId: userId })
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
        console.log(err)
        res.status(500).json({ message: "Internal Server Error" })
    }
}