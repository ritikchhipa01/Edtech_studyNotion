const Course = require("../models/course");
const User = require("../models/user");
const Category = require("../models/category");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.createCourse = async (req, res) => {

    try {

        const UserId = req.User.id; 
        //fetch data
        let { 
            courseName,
            couseDescription,
            whatYouWillLearn,
            price,
            tag,
            category,
            status,
            instructions,
            } = req.body;

        //thumbnail
        const thumbnail = req.files.thumbnailImage;

        //validation
        if (
            !courseName ||
            !couseDescription ||
            !whatYouWillLearn || 
            !price || 
            !category || 
            thumbnail ||
            !tag
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        //added
        if(!status || status === undefined){
            status = "Draft";
        }

        //check for Instructor
        const InstructorDetails = await User.findOne(UserId,{
            accountType:"Instructor",
        });
        console.log("Instructor Details", InstructorDetails);
        // Todo: verify whether user.id and instructorDetails._id are same or not?

        if (!InstructorDetails) {
            return res.status(400).json({
                success: false,
                message: "Instrutor Detail not found",
            })
        }

        //
        const categoryDetails = await Category.findById(category);
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Category Not Found",
            })
        }

        //upload image to cloudinary
        const thumbNailImage = await uploadImageToCloudinary(thumbnail, process.env.Folder_Name);

        //create a entry for new course
        const newCourse = await Course.create({
            courseName,
            couseDescription,
            Instructor: InstructorDetails._id,
            whatYouWillLearn,
            price,
            tag:tag,
            category: categoryDetails._id,
            thumbnail: thumbNailImage.secure_url,
            status: status,
            instructions: instructions,
        })

        // add the newCourse in user Schema
        await User.findByIdAndUpdate(
            { _id: InstructorDetails._id },
            {
                $push: {
                    courses: newCourse._id,
                }
            },
            { new: true },
        );

        //update Tag ka schema
        //home work do it yourself
        await Category.findByIdAndUpdate(
            { _id: category },
            {
                $push:{
                    course: newCourse._id,
                }
            },
            {new:true}
        );

        //return response
        return res.status(200).json({
            success: true,
            message: "Course Created successfully",
            data: newCourse,
        })

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create a Course",
            error: error.message,
        })

    }
}


//getAllCourse handler function

exports.showAllCourse = async (req, res) => {
    try {

        // /Todo: change the below statement incrementaly
        const allCourseData = await Course.find(
            {},
            {
                courseName: true,
                price: true,
                thumbnail: true,
                Instructor: true,
                ratingAndReviews: true,
                studentsEnrolled: true,
            }
        ).populate("Instructor")
            .exec();

        return res.status(200).json({
            success: true,
            message: "Data for all courses successfully",
            data: allCourseData,
        })

    } catch (error) {
        return res.status(404).json({
            success: false,
            message: "Failed to fetch course data",
            error: error.message,
        })
    }
}



// getcourseDetails

exports.getCourseDetails = async (req, res) => {
    try {
        //get id 
        const courseId = req.body;

        const courseDetails = await Course.find({ _id: courseId})
                                              .populate(
                                                {
                                                    path: "Instructor",
                                                    populate:{
                                                        path:"additionalDetails",
                                                }
                                                },
                                              )
                                              .populate("category")
                                              .populate("ratingAndReviews")
                                              .populate(
                                                {
                                                    path:"courseContent",
                                                    populate:{
                                                        path:"subSection",
                                                    }
                                                },
                                              )
                                              .exec();

        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message: `could not found course with ${courseId}`,
            })
        }

        return res.status(200).json({
            success:true,
            message: "course Details Sent successfully",
            data:courseDetails,
        })


    } catch (error) {
          return res.status(500).json(
            {
                success:false,
                message: error.message,
            }
          )
    }
}