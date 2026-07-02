const User = require('../models/User')
const OTP = require('../models/OTP')
const otpGenerator = require('otp-generator');





//sendotp
exports.sendOTP = async (req, res) => {

    try {
        //  fetch email from require ki id
        const { email } = req.body;

        // check if user already exised

        const checkUserPresent = await User.findOne({ email });

        //if uers already exited then return a response

        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User already regisered"
            })
        }

        //otp-generator

        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        })

        console.log("otp-generator:", otp)

        //check unquie otp or not
        let result = await OTP.findOne({
            otp: otp
        })

        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,

            })
            result = await OTP.findOne({ otp: otp })
        }
    }
    catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to send OTP"
        });

    }


};





// signup

exports.signUp = async (req, res) => {
    try {

        // 1. Fetch data from request body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp

        } = req.body;

        // 2. Validate input fields
        if (
            !firstName ||
            !lastName ||
            !email ||
            !password ||
            !confirmPassword ||
            !accountType ||
            !contactNumber ||
            !otp
        ) {
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            });
        }
        // 3. Check password and confirm password match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password do not match"
            });
        }
        // 4. Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }
        // 5. Find the latest OTP for this email
        const recentOTP = await OTP.find({ email })
            .sort({ createdAt: -1 })
            .limit(1);
        // 6. Validate OTP
        if (recentOTP.length === 0) {
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            });
        }

        if (otp !== recentOTP[0].otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }
        // 7. Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // 8. Create user in database

        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        });

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`,
        });
        // 9. Return success response
        return res.status(200).json({
            success: true,
            message: "User registered successfully",
            user,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "User registration failed. Please try again."
        });
    }
};


//login

exports.login = async (req, res) => {
    try {
        // 1. Fetch data from request body
        const { email, password } = req.body;
        // 2. Validate email and password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        // 3. Check if user exists
        const user = await User.findOne({ email }).populate("additionalDetails");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registered",
            });
        }
        // 4. Compare password using bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Incorrect Password",
            });
        }
        // 5. Generate JWT token
        const payload = {
            email: user.email,
            id: user._id,
            accountType: user.accountType,
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
                expiresIn: "2h",
            }
        );
        // 6. Save token in user object (optional)
        user.token = token;
        user.password = undefined;
        // 7. Create HTTP-only cookie
        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };

        res.cookie("token", token, options);
        // 8. Return success response
        return res.status(200).json({
            success: true,
            token,
            user,
            message: "Login Successful",
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Login failed. Please try again."
        });
    }
};




// changepassword

exports.changePassword = async (req, res) => {
    try {
        // 1. Get user ID from JWT (req.user.id)
const userId = req.user.id;
        // 2. Get oldPassword, newPassword, confirmPassword from req.body
const {
    oldPassword,
    newPassword,
    confirmPassword
} = req.body;
        // 3. Validate input fields
if (!oldPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({
        success: false,
        message: "All fields are required"
    });
}
        // 4. Find user by ID
const user = await User.findById(userId);
        // 5. Compare old password with stored password
const isMatch = await bcrypt.compare(
    oldPassword,
    user.password
);

if (!isMatch) {
    return res.status(401).json({
        success: false,
        message: "Old password is incorrect"
    });
}
        // 6. Check newPassword and confirmPassword match
if (newPassword !== confirmPassword) {
    return res.status(400).json({
        success: false,
        message: "New Password and Confirm Password do not match"
    });
}
        // 7. Hash new password
const hashedPassword = await bcrypt.hash(newPassword, 10);
        // 8. Update password in database
await User.findByIdAndUpdate(
    userId,
    {
        password: hashedPassword
    },
    {
        new: true
    }
);
        // 9. Send password updated email
await mailSender(
    user.email,
    "Password Updated Successfully",
    "Your password has been changed successfully."
);
        // 10. Return success response
return res.status(200).json({
    success: true,
    message: "Password updated successfully"
});
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Password could not be updated"
        });
    }
};