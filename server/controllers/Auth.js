const OTP = require("../models/OTP");
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');
const User = require("../models/user");
const profile = require("../models/profile");
const JWT = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const passwordUpdated = require("../mail/templates/passwordUpdate")
require("dotenv").config();
//SendOTP
exports.SendOTP = async (req, res) => {

    try {

        // fetch email from request's body
        const {email} = req.body;

        // check if user already exist
        const checkUserPresent = await User.findOne({ email });

        //if user exist return a response
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "user already registered",
            })
        }

        //generate OTP
        let otp = otpGenerator.generate(6, {
             upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false,
            
         });
        console.log("OTP generated Successfully", otp);

        //check is otp unique or not
        let result = await OTP.findOne({ otp: otp });

        while(result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                specialChars: false
            });

            result = await OTP.findOne({ otp: otp });
        }

        const otpPayload = {email,otp}; 
         
        //create an entry in Database for OTP
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        //return response successfull
        return res.status(200).json(
            {
                success: true,
                message: "OTP sent Successfully",
            }
        )

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }

}


//signup
exports.signUp = async (req,res) =>{
    try{
    //fetc data from request's body
    const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        contactNumber,
        otp,

    } = req.body;

    //validation of data
    if(!firstName || !lastName || !email || !password || !confirmPassword || !accountType || !contactNumber || !otp){
        return res.status(403).json({
            success: false,
            message: "All fields are required",
        });
    };

    // matching the password and confirmPassword
    if(password!==confirmPassword){
        return res.status(400).json({
            success: false,
            message: "PassWord and Confirmed password does not matched, Please try again."
        });
    };

    // check is user already registered
    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(400).json({
            success: false,
            message: "User is already registeres.",
        });
    };

    //find recent otp
    const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
    console.log(recentOtp);

    //validate recentOtp
    if(recentOtp.length === 0){
        return res.status(400).json({
            success: false,
            message: "OTP NOT FOUND",
        })
    }
    else if(otp !== recentOtp[0].otp){
        // Invalid otp 
        return res.status(400).json({
            success: false,
            message: "INVALID OTP",
        })
    }

    //Hashed Password
    const hashedPassword = await bcrypt.hash( password,10);

    //create the user 
    let approved = "";
    approved === "Instructor" ?(approved = false) : (approved = true);

    //create the additional profile for user
    const profileDetails = await profile.create({
        gender:null,
        dateOfBirth: null,
        about: null,
        contactNumber: null,
    })

    // create entry in db
    const user = await User.create({
        firstName,
        lastName,
        email,
        contactNumber,
        password: hashedPassword,
        accountType,
        approved: approved,
        additionalDetails: profileDetails._id,
        image: `https://api.dicebear.com/6.x/initials/svg?seed=${firstName} ${lastName}`

    });
    return res.status(200).json({
        success:true,
        message: "user is registered successfully",
        user,
    })
}
catch(error){
      console.log(error);
      return res.status(400).json({
        success: false,
        message: "user can't be registered, please try again",
      })
}  
}

//Login

exports.Login =async (req,res) =>{
    try {
        //get data from req body
        const {email, password} = req.body;
        
        //validation of data
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            })
        }


        //check if user exist or not
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success:false,
                message:"user does not exist, please  signup first",
            })
        }

        //match password and then generate JWT 
        if(await bcrypt.compare(password, user.password)){
            // const payload={
            //     email: user.email,
            //     id : user._id,
            //     // role: user.role,
            //     accountType: user.accountType,
            // }
            const token = JWT.sign({email:user.email,id:user._id, accountType:user.accountType},
                process.env.JWT_SECREt,
                {
                expiresIn:"24h",
                }
            )
            user.token = token;
            user.password = undefined;

            //create cookie and send response 
            const option = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly: true,
            }
            res.cookie("token",token,option).status(200).json({
                success:true,
                token,
                user,
                message: "Logged in successFully"
            })
            
        }
        else{
            return res.status(401).json({
                success: false,
                message: "password not match",
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success:false,
            message: "Login Failure, please try again",
        })
    } 

}

//changePassword
exports.changePassword =async (req,res) =>{
    //get data from req.body
    //get old password, newPassword, confirNewPassword
    //validation

    //update password in db
    //send password in db
    //return response 
    try {
		// Get user data from req.user
		const userDetails = await User.findById(req.user.id);

		// Get old password, new password, and confirm new password from req.body
		const { oldPassword, newPassword, confirmNewPassword } = req.body;

		// Validate old password
		const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);
		if (!isPasswordMatch) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res
				.status(401)
				.json({ success: false, message: "The password is incorrect" });
		}

		// Match new password and confirm new password
		if (newPassword !== confirmNewPassword) {
			// If new password and confirm new password do not match, return a 400 (Bad Request) error
			return res.status(400).json({
				success: false,
				message: "The password and confirm password does not match",
			});
		}

		// Update password
		const encryptedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUserDetails = await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		);

		// Send notification email
		try {
			const emailResponse = await mailSender(
				updatedUserDetails.email,
				passwordUpdated(
					updatedUserDetails.email,
					`Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
				)
			);
			console.log("Email sent successfully:", emailResponse.response);
		} catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

		// Return success response
		return res
			.status(200)
			.json({ success: true, message: "Password updated successfully" });
	} catch (error) {
		// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}
}