const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

// resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
    try {

        // 1. Get email from request body
        const { email } = req.body;
        // 2. Check whether user exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: " your email is   not registerd with us "
            });
        }
        // 3. Generate reset token
        const token = crypto.randomUUID();

        // 4. Save token and expiry in database
        await User.findOneAndUpdate(
            { email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 5 * 60 * 1000
            },
            {
                new: true
            }
        );
        // 5. Create reset password URL
        const url = `http://localhost:3000/update-password/${token}`;
        // 6. Send email
        await mailSender(
            email,
            "Password Reset Link",
            `Password reset link: ${url}`
        );
        // 7. Return success response
        return res.status(200).json({
            success: true,
            message: "Password reset link sent successfully"
        });
    } catch (error) {

        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong in"
        })

    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    try {

        // 1. Fetch data from request body
        const { password, confirmPassword, token } = req.body;

        // 2. Validation
        if (!password || !confirmPassword || !token) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // 3. Check password match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password do not match",
            });
        }

        // 4. Find user using token
        const user = await User.findOne({ token });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid Token",
            });
        }

        // 5. Check token expiry
        if (user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "token is  has expired. Please generate a new one.",
            });
        }

        // 6. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 7. Update password and clear token
        await User.findByIdAndUpdate(
            {token:token},
            {password: hashedPassword,},
            {new: true,}
        );

        // 8. Return response
        return res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while resetting password",
        });
    }
};