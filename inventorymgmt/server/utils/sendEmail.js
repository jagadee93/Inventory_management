const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler")
const sendEmail = asyncHandler(async (subject, message, send_to, sent_from, reply_to) => {
    const transporter = nodemailer.createTransport({

        host: process.env.EMAIL_HOST,
        port: 587,//according to the docs
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
        //not mandatory but we may run into some issues like mail not sending etc
        tls: {
            rejectUnauthorized: false
        }
    })
    //options for sending email
    const options = {
        from: sent_from,
        to: send_to,
        replyTo: reply_to,
        subject: subject,
        html: message

    }

    //sent the email
    transporter.sendMail(options, function (err, info) {
        if (err) {
            console.log(err)
        }
        console.log(info)
    })
})

module.exports = sendEmail