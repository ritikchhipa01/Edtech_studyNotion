const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
     courseName:{
        type:String,
        required:true
     },
     courseDescription:{
        type:String,
        required:true
     },
     Instructor:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"user"
     },
     WhatYouWillLearn:{
        type: String,
     },
     courseContent:[
        {
        type: mongoose.Schema.Types.ObjectId,
        ref:"section"
        }
    ],
     ratingAndReviews:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RatingAndReview"
     },
    price:{
        type:Number,
    },
    thumbnail:{
        type:String,
    },
    tag:{
       type: [String],
       required:true,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    studentsEnrolled:{
      type:mongoose.Schema.Types.ObjectId,
      required:true,
      ref:"user"
    },
    instructions:{
      type:[String],
    },
    status:{
      enum:["Draft", "Published"],
    }
});

module.exports = mongoose.model("course",courseSchema);