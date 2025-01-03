const express = require('express');

const groupController = require('../controllers/group');
const checkAuth = require('../middleware/auth');

const router = express.Router();

router.get('/', checkAuth.userAuthenticate, groupController.getGroups);

router.post('/', checkAuth.userAuthenticate, groupController.createGroup);

router.post('/join', checkAuth.userAuthenticate, groupController.addMember);

module.exports = router;