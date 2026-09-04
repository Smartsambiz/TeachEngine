const router = require("express").Router();
const {register, login} = require("../controllers/authController");

// POST /auth/register
router.post('/auth/register', register);

// POST login
router.post('/auth/login', login );


module.exports = router