const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

const otpSchema = new mongoose.Schema(
    {
        email:{
            type:String,
            required: true,
        },
        otp:{
           type:String,
           required:true,
        },
        createdAt:{
            type:Date,
            default:Date.now(),
            expires: 5*60,
        }
    }
)

const sendVerificationMail = async (email,otp) => {

    //send the email
    try{
      const mailResponse = await mailSender(
        email,
        "verification mail from codehelp",
        emailTemplate(otp));
      console.log("Email Sent Successfully",mailResponse);
    }
    catch(err){
        console.log("Error in sending verification mail",err);
        throw(err);
    }
}

otpSchema.pre("save",async function (next){
    console.log("New document saved to database");
    //send mail only for new document
    if(this.isNew){
        await sendVerificationMail(this.mail,this.otp);
    }
    next();
})

module.exports = mongoose.Schema("OTP",otpSchema);