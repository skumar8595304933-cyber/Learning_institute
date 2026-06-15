const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 5 * 60, // 5 minutes
    },
});

async function sendVerification(email, otp) {
    try {
        const mailResponse = await mailSender(
            email,
            "Verification Email from StudyNotion",
            `<h1>Please confirm your OTP</h1>
             <p>Your OTP is <b>${otp}</b></p>`
        );

        console.log("Email sent successfully:", mailResponse);
        return mailResponse;
    } catch (err) {
        console.log("Error while sending email:", err);
        throw err;
    }
}


OTPSchema.pre("save", async function (next) {
    try {
        await sendVerification(this.email, this.otp);
        next();
    } catch (error) {
        next(error);
    }
});

module.exports=mongoose.model("OTP",OTPSchema);