const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../model/userModel")

const protect = asyncHandler(async (req, res, next) => {
    console.log("hello")
    try {
        const token = req.cookies.token;
        // console.log(token)
        if (!token) {
            console.log("no token")
            res.status(401)
            throw new Error("token Not authorized please login ")

        }
        //verify token
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(verified.id).select("-password").lean();
        if (!user) {
            res.status(401)
            throw new Error("user not found")
        }
        //setting the request to have the information of the user
        //saving the user data in the request 
        req.user = user
        //calling the next  func because it is a middle ware
        next();
    } catch (err) {
        res.status(401)
        throw new Error("Not authorized please login catch")

    }
})

module.exports = {
    protect
}