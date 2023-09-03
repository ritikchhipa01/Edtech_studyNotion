const Section = require("../models/section");
const subSection = require("../models/subSection");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.createSubSection = async (req, res) => {

    try {

        //fetch data 
        const { sectionId, title, timeDuration, description } = req.body;
        //extract video file 
        const video = req.files.videoFile;
        //validaiton
        if (!sectionId || !title || !timeDuration || !description || !video) {
            return res.status(400).json({
                success: false,
                message: "All Fields are required",
            })
        }

        // upload video to cloudinary 
        const uploadDetails = await uploadImageToCloudinary(video, process.env.Foler_Name);

        // create a subSection
        const subSectionDetails = await subSection.create({
            title: title,
            timeDuration: timeDuration,
            description: description,
            videoUrl: uploadDetails.secure_url,
        });

        //update section with subsection details
        const updateSection = await Section.findByIdAndUpdate(
            {_id:sectionId},
            {
                $push: {
                    subSection: subSectionDetails._id,
                }
            },
            { new: true },
        ).populate("subSection");
        
        // Hw: log updated section her, after populate  the query

        //return response
        return res.status(200).json({
            success: true,
            message: "Sub-section created successfully",
            updateSection,
        })


    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        })

    }
}


//Hw : Update subSection 

exports.updateSubSection = async (req, res) => {
    try {

        //fetch data 
        const { subSectionId, title , timeDuration, description} = req.body;

        //validation
        if (!title || !subSectionId) {
            return res.status(400).json({
                success: false,
                message: "Missing properties"
            })
        }

        // update sub-section by subsectionId
        const updateSubSectionDetails = await subSection.findByIdAndUpdate(subSectionId, {
                 title,
                 timeDuration,
                 description,

        },
        {new:true}
        )
         
        //return response 
        return res.status(200).json({
            success:false,
            message: "Sub-section updated successfully",
            updateSubSectionDetails,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "unable to update Sub-section",
            error: error.message
        })
    }
}

//Hw : delete subsection

exports.deleteSubSection = async (req, res) => {
    try {
        //get Id - assuming we are sending id in params
         const {subSectionId} = req.params;
    
        //validation
        if(!subSectionId){
            return res.status(400).json({
                success:false,
                message:"Missin sub-section Id "
            })
        }

        await subSection.findByIdAndDelete(subSectionId);

        return res.status(200).json({
            success: true,
            message: "Sub-Section deleted succefully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "unable to delete Sub-section",
            error: error.message
        })
    }
}

