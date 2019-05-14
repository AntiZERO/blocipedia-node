const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const validation = require("./validation");


router.get("/users/signup", validation.validateSignUp, userController.signUp);
router.get("/users/signin", userController.signInForm);
router.post("/users/signin", validation.validateSignIn, userController.signIn);
router.get("/users/signout", userController.signOut);
router.post("/users", userController.create);

module.exports = router;