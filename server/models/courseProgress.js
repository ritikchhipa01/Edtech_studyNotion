const mongoose = require("mongoose");

const CourseProgressSchema = new mongoose.Schema({
     courseId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "course"
     },
     completedVideos:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "subSection",
     }
});

module.exports = mongoose.model("courseProgress",CourseProgressSchema);