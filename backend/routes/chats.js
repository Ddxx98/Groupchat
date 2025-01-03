const express = require('express');

const chatsController = require('../controllers/chats');
const checkAuth = require('../middleware/auth');

const router = express.Router();

router.post('/', checkAuth.userAuthenticate, chatsController.addChats);

router.get('/', checkAuth.userAuthenticate, chatsController.getChats);

router.get('/', checkAuth.userAuthenticate, chatsController.getLastChat);

router.get('/getGroupChat', checkAuth.userAuthenticate, chatsController.getGroupChat);

module.exports = router;