const express = require('express');

const router = express.Router();
const AuthController = require('../controllers/auth.controller');

router.post('/register', AuthController.signup);
router.post('/login', AuthController.signin);

module.exports = router;
