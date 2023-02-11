//when updating make sure that don't user lean method

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
    const user = await User.findById(req.user._id).select("-password").lean();
    if (user) {
        const { _id, name, email } = user;
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


const loginstatus = asyncHandler(async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json(false)
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET)
    if (verified) {
        return res.json(true)
    }
    return res.json(false)
})


const updateuser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    if (user) {
        console.log(user)
        const { name, photo, bio } = user;
        user.name = req.body.name || name;
        user.photo = req.body.photo || photo;
        user.bio = req.body.bio || bio;

        const updatedUser = await user.save();
        res.json({
            name: updatedUser.name,
            bio: updatedUser.bio,
            photo: updateuser.photo,

        })
    }

    res.status(400)
    throw new Error("invalid user")

})


const changePassword = asyncHandler(async (req, res) => {
    const { password, newpassword } = req.body;
    //validating
    if (!password || !newpassword) {
        res.status(400)
        throw new Error("please add old password and newpassword ")
    }
    const user = await User.findById(req.user._id).select("password")
    console.log(user)
    if (user) {
        const isPassWordMatch = await bcrypt.compare(password, user.password)
        if (isPassWordMatch) {
            user.password = newpassword;
            user.save();
            res.status(200).json({ message: "password successfully updated" })
        }
        res.status(400)
        throw new Error("invalid old password")
    }

    res.status(400)
    throw new Error("invalid user")


});

module.exports = {
    createUser,
    loginUser,
    logoutUser,
    getUser,
    loginstatus,
    updateuser,
    changePassword
}


