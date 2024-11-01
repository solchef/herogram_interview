const express = require('express');
const {
    register,
    login,
    authenticateJWT,
    protectedRoute,
} = require('../controllers/UserController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/protected', authenticateJWT, protectedRoute);

module.exports = router;
