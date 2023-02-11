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


module.exports = router
module.exports = router