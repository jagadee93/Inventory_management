//when updating make sure that don't user lean method
const crypto = require("node:crypto")
const User = require("../model/userModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Token = require("../model/tokenModel");
const sendEmail = require("../utils/sendEmail");
const token = require("../model/tokenModel");
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




const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(400)
        throw new Error("Please enter a valid email")
    }

    const user = await User.findOne({ email })
    if (!user) {
        res.status(404)
        throw new Error("user does not exist")
    }

    //delete of the previous token if it exists 
    const token = Token.findOne({ userId: user._id })
    if (token) {
        await token.deleteOne()
    }
    //create a reset token 
    let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    //save token into db

    await new Token({
        userId: user._id,
        token: hashedToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + 30 * (60 * 1000),//30min
    }).save();
    //construct url 
    const resetUrl = `${process.env.FRONT_END_URL}/resetpassword/${resetToken}`
    const message = `
    <h1>Hello ${user.name}</h1>
    <p>please use the url below to reset your  password </p>
    <p>This reset link is valid for only 30 minutes</p>
    <a href=${resetUrl} clicktracking=off >${resetUrl}</a>
    <p>Regards Jagadeeshgongidi</p>`;
    const subject = "password reset Request";
    const send_to = user.email;
    const sent_from = process.env.EMAIL_USER;
    try {
        await sendEmail(subject, message, send_to, sent_from);
        res.status(200).json({ success: true, message: "reset email sent" })
    } catch (err) {
        res.status(500)
        throw new Error("email not sent please try again after sometime")
    }
})


const resetpassword = asyncHandler(async (req, res) => {

    const { password } = req.body;
    if (!password || password.length < 6) {
        res.status(400)
        throw new Error("password must be at least 6 characters")
    }
    const { resetToken } = req.params;
    //hash token then compare it to the token in DB
    //because we have saved hashed version in db
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const userToken = await Token.findOne({ token: hashedToken, expiresAt: { $gt: Date.now() } })
    console.log(resetToken, hashedToken, userToken.token)

    if (!userToken) {
        res.status(404)
        throw new Error("invalid or expired token ")
    }
    //find the user
    const user = await User.findOne({ _id: userToken.userId })

    user.password = password;
    await user.save();
    res.status(200).json({ message: "password reset successful please login" })
})

module.exports = {
    createUser,
    loginUser,
    logoutUser,
    getUser,
    loginstatus,
    updateuser,
    changePassword,
    forgotPassword,
    resetpassword
}


