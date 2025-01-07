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
        const group = await Groups.create({ groupName: groupName, creatorId: creatorId })
        const user = await GroupUser.create({ groupId: group.id, userId: creatorId, isAdmin: true })
        res.status(201).json({ message: "Group created", groupId: group.id })
    } catch(err) {
        console.log(err)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.addMember = async (req, res, next) => {
    const groupId = req.body.groupId
    const userId = req.body.userId
    console.log(req.body)
    try{
        const group = await Groups.findOne({ where: { id: groupId } })
        if(!group) {
            return res.status(404).json({ message: "Group not found" })
        }
        const isMember = await GroupUser.findOne({ where: { groupId: groupId, userId: userId } })
        if(isMember) {
            return res.status(409).json({ message: "User is already a member of the group" })
        }
        const user = await GroupUser.create({ groupId: groupId, userId: userId, isAdmin: false })
        res.status(201).json({ message: "Member added", memberId: user.id, isAdmin: user.isAdmin })
    } catch(err) {
        console.log(err)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.insideGroup = async (req, res, next) => {
    const groupId = req.body.groupId
    try{
        const group = await Groups.findOne({ where: { id: groupId } })
        if(!group) {
            return res.status(404).json({ message: "Group not found" })
        }
        const isMember = await GroupUser.findOne({ where: { groupId: groupId, userId: req.user.id } })
        if(!isMember) {
            return res.status(409).json({ message: "User is not a member of the group" })
        }
        res.status(200).json({ message: "User is a member of the group", isAdmin: isMember.isAdmin })
    } catch(err) {
        console.log(err)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.deleteMember = async (req, res ) => {
    const groupId = req.query.groupId
    const userId = req.query.userId
    try{
        const group = await Groups.findOne({ where: { id: groupId } })
        if(!group) {
            return res.status(404).json({ message: "Group not found" })
        }
        const isMember = await GroupUser.findOne({ where: { groupId: groupId, userId: userId } })
        if(!isMember) {
            return res.status(409).json({ message: "User is not a member of the group" })
        }
        await GroupUser.destroy({ where: { groupId: groupId, userId: userId } })
        res.status(200).json({ message: "Member deleted" })
    } catch(err) {
        console.log(err)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.promoteMember = async (req, res ) => {
    const groupId = req.body.groupId
    const userId = req.body.userId
    try{
        const group = await Groups.findOne({ where: { id: groupId } })
        if(!group) {
            return res.status(404).json({ message: "Group not found" })
        }
        const isMember = await GroupUser.findOne({ where: { groupId: groupId, userId: userId } })
        if(!isMember) {
            return res.status(409).json({ message: "User is not a member of the group" })
        } else if(isMember.isAdmin) {
            return res.status(409).json({ message: "User is already an admin of the group" })
        }
        await GroupUser.update({ isAdmin: true }, { where: { groupId: groupId, userId: userId } })
        res.status(200).json({ message: "Member promoted" })
    } catch(err) {
        console.log(err)
        res.status(500).json({ message: "Internal Server Error" })
    }
}