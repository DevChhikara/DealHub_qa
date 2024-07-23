const express = require('express');
const passport = require('passport');

const router = express.Router();

const UserController = require('../controllers/userController');
router.post('/GetClientKey', UserController.getClientKey);
module.exports = router;
