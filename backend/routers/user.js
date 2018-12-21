const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');

router.post("/signup",
userController.signup
);

router.post("/update", checkAuth, userController.update)

router.post("/login",
userController.login);

router.get("/:username", userController.getUser)


module.exports = router;
