const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const validation = require("./validation");


router.get("/users/signup", validation.validateSignUp, userController.signUp);
router.get("/users/signin", userController.signInForm);
router.post("/users/signin", validation.validateSignIn, userController.signIn);
router.get("/users/signout", userController.signOut);
router.post("/users", userController.create);

router.get('/users/:id', userController.show);
router.get('/users/:id/upgradeForm', userController.upgradeForm);
router.get('/users/:id/downgradeForm', userController.downgradeForm);
router.post('/users/:id/upgrade', userController.upgrade);
router.post('/users/:id/downgrade', userController.downgrade);

module.exports = router;