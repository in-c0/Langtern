const express = require('express');
const router = express.Router();
const { registerUser, searchHandler, loginUser } = require('../controllers/usercontroller');

router.post('/register', registerUser);
router.post('/search', searchHandler);
router.post('/login', loginUser);

module.exports = router;