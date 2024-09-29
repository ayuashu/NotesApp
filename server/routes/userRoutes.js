const express = require('express');
const auth = require('../middleware/authMiddleware');
const { register, login, getUser } = require('../controllers/userController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/get-user', auth, getUser);

module.exports = router;