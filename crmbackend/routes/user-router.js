const express = require('express');
const { check } = require('express-validator')

const HttpError = require('../models/http-error')
const router = express.Router();

const usersController = require('../controllers/users-controller')


router.post('/login', usersController.userLogin);

router.post('/getUsersList', usersController.getUsersList);

router.post('/forgetPassword', usersController.forgetPassword);

router.post('/verifyOtp', usersController.otpVerify);



module.exports = router;