const User = require("../models/user");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");


//resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
    try {
        //get email
        const email = req.body.email;
        //check user for this email, verify this mail
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.json({
                success: false,
                message: "Your email is not registered",
            })
        }

        //generate token
        const token = crypto.randomBytes(20).toString("hex");

        //update user by adding token and expire time
        const updateDetails = User.findOneAndUpdate(
            { email: email }
            , {
                token: token,
                resetPasswordExpires: Date.now() + 60 * 60 * 1000,
            },
            { new: true }
        )

        console.log("Details", updateDetails);

        //create-url
        const url = `https://localhost:3000/update-password/${token}`;

        //send mail containing url
        await mailSender(email,
            "Reset Password ",
            `Your link for Reset password is, click to reset password ${url}`);

        return res.json({
            success: true,
            message: "Mail sent successfully, Please check your mail inbox to reset password",
            updateDetails,
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "something went wrong, while reset password"
        })
    }
}


//resetPassword

exports.resetPassword = async (req, res) => {
    
    try {
        
    
    //data fetch
    const { password, confirmPassword, token } = req.body;

    //validation
    if (password !== confirmPassword) {
        return res.json({
            success: false,
            message: "password doesn't match, please try again",

        })
    }
    //get user details from db 
    const userDetails = await User.findOne({ token: token });
    // if no entry, token is empty
    if (!userDetails) {
        return res.json({
            success: false,
            message: "Invalid Token",
        }
        )
    }

    //token time check
    if (userDetails.resetPasswordExpires < Date.now()) {
        return res.json({
            success: false,
            message: "Token is expired, please regenrate the token"
        })
    }

    //hashPassword
    const encryptPassword = await bcrypt.hash(password, 10);

    //password
    await User.findOneAndUpdate(
        { token: token },
        { password: encryptPassword },
        { new: true },
    )

    //return response
    return res.json(200).json({
        success:true,
        message: "Password reset Successfully",
    })

} catch (error) {
    console.log(error);
    return res.status(500).json({
        success:false,
        message: "Something went wrong, while reseting the password",
    })
}
}