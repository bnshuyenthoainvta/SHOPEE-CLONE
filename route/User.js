const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

//Register
router.get('/', userController);
//Auth
router.post('/', userController);
//Update
router.put('/', userController);
//Delete
router.delete('/', userController);

module.exports = router;