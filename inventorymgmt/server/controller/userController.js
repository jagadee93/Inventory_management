const User = require("../model/userModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" })
}


//register user 
const createUser = asyncHandler(async (req, res) => {
    const { email, name, password } = req.body;
    console.log(email, name, password);
    if (!email || !password || !name) {
        res.status(400)
        throw new Error("please fill all the fields")
    }
    if (password.length < 6) {
        res.status(400)
        throw new Error("password must be at least 6 characters")
    }

    const ExistedUser = await User.findOne({ email }).lean().exec()
    console.log(ExistedUser)
    if (ExistedUser) {
        res.status(400)
        throw new Error("user already exists")
    }


    // const salt = await bcrypt.genSalt(10)
    // const hashedPassword = await bcrypt.hash(password, salt)
    const user = await User.create({
        name,
        email,
        password,
    });

    const token = generateToken(user._id);
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), //1day
        sameSite: "none",
        secure: true,
    })


    if (user) {
        const { _id, name, email } = user;
        res.status(201).json({
            status: 'success',
            data: {
                _id, name, email, token
            }
        })
    } else {
        res.status(400)
        throw new Error("invalid user data")
    }



});

//login user

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400)
        throw new Error("Please enter a valid email address and password")
    }


    const user = await User.findOne({ email }).lean();
    console.log(user)
    //check if user passed is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    const token = generateToken(user._id);
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), //1day
        sameSite: "none",
        secure: true,
    })

    console.log(isPasswordCorrect)


    if (user && isPasswordCorrect) {
        const { _id, name, email } = user;
        res.status(201).json({
            status: 'success',
            data: {
                _id, name, email, token
            }
        })
    }
    else {
        res.status(400)
        throw new Error("invalid email or password");
    }

});


const logoutUser = asyncHandler(async (req, res) => {
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0), //immediately expires 
        sameSite: "none",
        secure: true,
    })
    return res.status(200).json({ message: "Successfully logged out" })
});


const getUser = asyncHandler(async (req, res) => {
    const { user } = req;
    const existedUser = await User.findById(user._id).select("-password").lean();
    if (user) {
        const { _id, name, email } = existedUser;
        res.status(201).json({
            status: 'success',
            data: {
                _id, name, email,
            }
        })
    } else {
        res.status(400)
        throw new Error("user not found")
    }

})

module.exports = {
    createUser,
    loginUser,
    logoutUser,
    getUser
}


