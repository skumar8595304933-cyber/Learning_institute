const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

exports.auth = async (req, res, next) => {
    try {

        // Extract Token
        const token =
            req.cookies.token ||
            req.body.token ||
            req.header("Authorization")?.replace("Bearer ", "");

        // Check Token
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            });
        }

        try {

            // Verify Token
            const decode = jwt.verify(
                token,
                process.env.JWT_SECRET
            );
            console.log("decode:",decode)
            req.user = decode;

        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Token is invalid",
            });
        }

        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while validating token",
        });
    }
};

// isStudent

exports.isStudent = async (req, res, next) => {
    try {

        if (req.user.accountType !== "Student") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Students",
            });
        }

        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified",
        });
    }
};

// isInstructure

exports.isInstructor = async (req, res, next) => {
    try {

        if (req.user.accountType !== "Instructor") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Instructors",
            });
        }

        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified",
        });
    }
};



//isAdmin

exports.isAdmin = async (req, res, next) => {
    try {

        if (req.user.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Admins",
            });
        }

        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified",
        });
    }
};

