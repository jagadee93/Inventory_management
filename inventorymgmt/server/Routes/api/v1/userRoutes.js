const express = require('express');
const userController = require("../../../controller/userController")
const router = express.Router();
const protectRoute = require("../../../middleware/authMiddleware")
router.route("/register")
    .post(userController.createUser)
router.route("/login")
    .post(userController.loginUser)
router.route("/logout")
    .get(userController.logoutUser)
router.route("/getuser")
    .get(protectRoute.protect, userController.getUser)
router.route("/loginstatus")
    .get(userController.loginstatus)
router.route("/updateuser")
    .patch(protectRoute.protect, userController.updateuser)

router.route("/updatepassword")
    .patch(protectRoute.protect, userController.changePassword)
router.route("/forgotpassword")
    .post(userController.forgotPassword)
router.route("/resetpassword/:resetToken")
    .put(userController.resetpassword)

module.exports = router
module.exports = router