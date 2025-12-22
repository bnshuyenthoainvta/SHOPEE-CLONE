const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

//Register
router.post('/register', userController.registerUser);
//Auth
router.post('/auth', userController.authUser);
//Update
router.put('/update', userController.updateUser);
//Delete
router.delete('/delete/:id', userController.deleteUser);
//Reset token
router.get('/refresh', userController.resetAccessToken);

module.exports = router;