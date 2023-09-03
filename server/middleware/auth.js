const JWT = require("jsonwebtoken");
require("dotenv").config();
// const user = require("../models/user");

//Auth
exports.auth = async (req, res, next) => {

    try {

        //extract token
        const token = req.cookies.token ||
                      req.body.token || 
                      req.header("Authorisation").replace("Bearer ", "");

        //if token is missing, then return response
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            })
        }
        //verify token
        try {
            const decode = await JWT.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        } catch (error) {
            //verification issue 
            return res.status(400).json({
                success: false,
                message: "token is Invalid"
            });
        }
        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "something went wrong while validation the token",
        })
    }
}
//isStudent 
exports.isStudent = async (req, res, next) => {
    try {

        if (req.user.accountType !== "student") {
            return res.status(401).json({
                success: false,
                message: "This is a Protected Route for students only",
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Invalid Account Type, please Try again",
        })
    }
}

//isInstructor
exports.isInstructor = async (req, res, next) => {
    try {

        if (req.user.accountType !== "Instructor") {
            return res.status(401).json({
                success: false,
                message: "This is a Protected Route for Instructor only",
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please Try again",
        })
    }
}

//isAdmim
exports.isAdmin = async (req, res, next) => {
    try {

        if (req.user.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "This is a Protected Route for Admin only",
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please Try again",
        })
    }
}