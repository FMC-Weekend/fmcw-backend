const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.get('/user', userController.getUserDetails);
router.patch('/user', userController.updateUserDetails);
router.get('/alluser', userController.getAllUsers);
router.get('/delete', userController.deleteAllUsers);
router.get('/delete/ca', userController.deleteAllCa);
router.get('/delete/pa', userController.deleteAllPa);
router.get('/allca', userController.getAllCa);
router.get('/allpa', userController.getAllPa);
router.get('/allin', userController.getAllInsti);

module.exports = router;
