const express = require('express');

const groupController = require('../controllers/group');
const checkAuth = require('../middleware/auth');

const router = express.Router();

router.get('/', checkAuth.userAuthenticate, groupController.getGroups);

router.post('/', checkAuth.userAuthenticate, groupController.createGroup);

router.post('/add', checkAuth.userAuthenticate, groupController.addMember);

router.post('/insideGroup', checkAuth.userAuthenticate, groupController.insideGroup);

router.delete('/delete', checkAuth.userAuthenticate, groupController.deleteMember);

router.post('/promote', checkAuth.userAuthenticate, groupController.promoteMember);

module.exports = router;