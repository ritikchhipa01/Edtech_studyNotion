const { instance } = require("../config/razorpay");
const User = require("../models/user");
const Course = require("../models/course");
const mailSender = require("../utils/mailSender");
const { default: mongoose } = require("mongoose");

//capture the payment and initiate the order 
exports.capturePayment = async (req, res) => {

    //get course Id and UserId
    const { courseId } = req.body;
    const UserId = req.User.id;
    //validation
    //validation of courseId
    if (!courseId) {
        return res.status(404).json({
            success: false,
            message: "Please provide a valid course Id"
        })
    }

    //validation of courseDetails
    let course;
    try {
        course = await Course.findById(courseId);

        if (!course) {
            return res.json({
                success: false,
                message: "Course not found",
            })
        }

        //Is user is already pay for same course
        const uId = mongoose.Types.ObjectId(UserId);

        if (Course.studentsEnrolled.includes(uId)) {
            return res.status(200).json({
                success: false,
                message: "Student is already Enrolled",
            })
        }

        //return res
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }

    //order create 
    const amount = course.price;
    const currency = "INR";

    const options = {
        amount: amount * 100,
        currency: currency,
        receipt: Math.random(Date.now()).toString(),
        notes: {
            courseId: courseId,
            userId: UserId,
        }
    }
    try {
        //initiate the payment using razorpay
        const PaymentResponse = await instance.orders.create(options);
        console.log(PaymentResponse);

        //return res 
        return res.status(200).json({
            success: true,
            courseName: course.courseName,
            CourseDescription: course.courseDescription,
            thumbNail: course.thumbnail,
            OrderId: PaymentResponse.id,
            currency: PaymentResponse.currency,
            amount: PaymentResponse.amount,
        })
    } catch (error) {
        return res.json({
            success: false,
            message: "could not initiate payment"
        })
    }
};


//verify signature of razorpay and server
exports.verifySignature = async (req, res) => {

    const webhookSecret = "123456789";

    const signature = req.headers["x-razorpay-signature"];

    const shasum = crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (signature === digest) {
        console.log("Payment is Authorised")

        const { courseId, userId } = req.body.paylod.payment.entity.notes;

        try {

            //find the course and enroll the student in it
            const enrolledCourse = await Course.findByIdAndUpdate(
                { _id: courseId },
                {
                    $push: {
                        studentsEnrolled: userId,
                    }
                },
                { new: true },
            );

            if (!enrolledCourse) {
                return res.status(500).json({
                    success: false,
                    message: "course not found",
                })
            }
            console.log(enrolledCourse);


            //find the student and course to their list enrolled course me
            const enrollStudent = await User.findByIdAndUpdate(
                { _id: userId },
                {
                    $push: {
                        courses: courseId,
                    }
                },
                { new: true }
            )

            if (!enrollStudent) {
                return res.status(500).json({
                    success: false,
                    message: "User not found"
                })
            }

            // sending the confirmation mail            
            const emailResponse = await mailSender(
                enrollStudent.email,
                "congratulations from codehelp",
                `Congratulations ${enrollStudent.FirstName}, you are onborded to codehelp new course`,
            )

            console.log(emailResponse);

            return res.status(200).json({
                success:true,
                message: "Signature verified and course added successfully",
            })
        } catch (error) {
             return res.status(500).json({
                success:false,
                message: error.mailSender,
             })
        }
    }
    else{
        return res.status(400).json({
            success:false,
            message: "Invalid request",
        })
    }

}