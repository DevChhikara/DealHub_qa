const express = require('express');
const router = express.Router();

// Routes

const authRoutes = require('./auth.route')

router.use('/Api/Auth', authRoutes);

module.exports = router;
