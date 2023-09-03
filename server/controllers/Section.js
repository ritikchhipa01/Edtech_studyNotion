const Section = require("../models/section");
const Course = require("../models/course");

// create section handler function
exports.createSection = async (req, res) => {

    try {
        //data fetch
        const { sectionName, courseId } = req.body;

        //data validation
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Missing Properties",
            });
        }

        //create section
        const newSection = await Section.create({ sectionName });

        //update course with section objectId
        const updateCourseDetails = await Course.findByIdAndUpdate({ courseId },
            {
                $push: {
                    courseContent: newSection._id,
                }
            },
            { new: true }
        ).populate({
            path: "courseContent",
            populate:{
                path: "subSection",
            }
        })
        .exec();

        //HW: use populate to replace to section/subsection both in updateDetailsCourse
        //return response
        return res.status(200).json({
            success: true,
            message: "Section Created successfully",
            updateCourseDetails,
        })


        //
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to Create a Section  ):"
        })

    }
}


//Update section handler function

exports.updateSection = async (req, res) => {

    try {
        //data fetch
        const { sectionName, sectionId } = req.body;

        // data validation
        if (!sectionId || !sectionName) {
            return res.status(400).json({
                success: false,
                message: "Missing properties"
            })
        }

        const updateCourseDetails = await Section.findByIdAndUpdate(sectionId,
            {
                sectionName,
            },
            { new: true }
        )

        //return response 
       res.status(200).json({
            success: false,
            message: "Section Updated successfully",
            updateCourseDetails,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "unable to update a Section  ):"
        })

    }
}


//delete section 

exports.deleteSection = async (req, res) => {
    try {
        //get Id - assuming we are sending id in params
        const { sectionId } = req.params;

        if (!sectionId) {
            return res.status(400).json({
                success: false,
                message: "Missing CourseId properties"
            })
        }
        //delete 
        await Section.findByIdAndDelete(sectionId);
        //Todo[testing]: do we need to delete entry of section from the course schema

        res.status(200).json({
            success: true,
            message: "Section deleted succefully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "unable to delete a Section  ):",
            error: error.message
        })
    }
}