const express = require('express');
const { check } = require('express-validator')

const HttpError = require('../models/http-error')
const router = express.Router();

const adminController = require('../controllers/admin-controller')

//for getting all users list
router.get('/getAdminsList', adminController.getAdminsList);

//for creating a new user
router.post('/createUser',
[ check('name').not().isEmpty(),
  check('email').normalizeEmail().isEmail(),
  check('role').not().isEmpty(),
  check('password').isLength({ min : 6})
],adminController.createUser);


router.post('/login', adminController.adminLogin)

module.exports = router;