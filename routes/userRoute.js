const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/signup', userController.signup);
router.post('/signin', userController.signin); 
router.get('/getInfo/:userId', userController.getUserInfo);
router.get('/getInstructors', userController.getInstructors);

module.exports = router;
