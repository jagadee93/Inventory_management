const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

const Schema = mongoose.Schema
const userSchema = Schema({
    name: {
        type: String,
        required: [true, "please add a name"],
        unique: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: [true, "please add an email"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "please enter valid email"
        ]
    },
    password: {
        type: String,
        trim: true,
        required: [true, "please add a password"],
        minlength: [6, "password must be upto 6 characters"],
        //maxLength: [23, "password must not be more than 23 characters"]
    },
    photo: {
        type: String,
        required: [true, "please add a photo"],
        default: "wq",
    },
    phone: {
        type: Number,
        required: false
    },
    bio: {
        type: String,
        maxLength: [100, "bio can be upto 30 characters"],
        required: false
    },

},
    {
        timestamps: true
    }
);


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
})

const User = mongoose.model("user", userSchema)
module.exports = User