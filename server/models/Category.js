const mongoose = require("mongoose");


const CategorySchema = new mongoose.Schema(
    {
     name:{
        type:String,
        required: true
     },
     description: {
        type: String,
     },
     course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course"
     }
    }
)


module.exports = mongoose.model("Category",CategorySchema);