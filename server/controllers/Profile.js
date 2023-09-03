const Profile = require("../models/profile");
const user = require("../models/user");
const User = require("../models/user");


exports.updateProfile = async (req,res) =>{
    try {
        //fetch data
        const {dateOfBirth="", contactNumber, about="", gender}  = res.body;
        // get user id 
        const id = req.User.id;
        //validation
        if(!contactNumber || !gender ||id ){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }

        //find user  profile 
        const UserDetails = await User.findById(id);
        // const profileId = await UserDetails.additionalDetails._id;
        const profileDetails = await Profile.findById(UserDetails.additionalDetails);

        //update profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.contactNumber = contactNumber;
        profileDetails.about = about;
        profileDetails.gender = gender;
        //save updated profile
        await profileDetails.save();

        // return response 
        return res.status(200).json({
            success:true,
            message: "Profile update successfully.",
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"failed to update Profile."
        })
    }
}

//Hw: how can we this scheduled the account deletion operation
//delete Account

exports.deleteAccount = async (req,res) =>{
     try {
        //get id 
        const id = req.User.id;
        const UserDetails = await User.findById({_id:id});
        //validation
        if(!UserDetails){
            return res.status(404).json({
                success:false,
                message:"User not found",
            })
        }
        //delete profile associated with the user
        await  Profile.findByIdAndDelete({_id: user.userDetails});

        //delete user now
        await User.findByIdAndDelete({_id:id});

        //return response 
        return res.status(200).json({
            success: false,
            message: "User Deleted successfully"
        })
     } catch (error) {
        return res.status(500).json({
            success:false,
            message: "User can not be deleted successfully",
        });
     }
}
//get all user details
exports.gelAllUserDetails = async (req,res) =>{
    try {
        //get id 
        const id = req.User.id;

        const userDetails = await User.findById(id).populate("additionalDetails").exec();

        //return response
        return res.status(200).json({
            success:true,
            message: "All user Details fetched successfully",
            data: userDetails,
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: "Failed to Fetched all user details",
            error:  error.message,
        })
    }
}