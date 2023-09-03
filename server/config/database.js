const mongoose = require("mongoose");
require("dotenv").config();

exports.server = () =>{
    mongoose.connect(process.env.DATABASE_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(() => console.log("DB Connected Successfully"))
    .catch((error) => {
        console.log("DB Connection Fail");
        console.log(error);
        process.exit(1);
    });
}

