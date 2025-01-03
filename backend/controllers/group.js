const Groups = require('../models/groups');
const GroupUser = require('../models/groupUser');

exports.getGroups = async (req, res, next) => {
    try{
        const groups = await Groups.findAll()
        res.status(200).json({ message: "Groups fetched", groups: groups })
    } catch(err) {
        res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.createGroup = async (req, res, next) => {
    const groupName = req.body.groupName
    const creatorId = req.user.id;
    try{
        const group = await Groups.create({ groupName: groupName, creatorId: creatorId, allowedMembers: [creatorId] })
        res.status(201).json({ message: "Group created", groupId: group.id })
    } catch(err) {
        console.log(err)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.addMember = async (req, res, next) => {
    const groupId = req.body.groupId
    const userId = req.user.id
    console.log(req.body)
    try{
        const group = await Groups.findOne({ where: { id: groupId } })
        if(!group) {
            return res.status(404).json({ message: "Group not found" })
        }
        const user = await GroupUser.create({ groupId: groupId, userId: userId })
        res.status(201).json({ message: "Member added", memberId: user.id })
    } catch(err) {
        console.log(err)
        res.status(500).json({ message: "Internal Server Error" })
    }
}