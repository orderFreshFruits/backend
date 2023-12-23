const mongoose = require("mongoose")

const signUpSchema = new mongoose.Schema({
    username : {
        type : String,
        trim : true,
        required : true,
    }
    ,
    email : {
        type : String,
        trim : true,
        required : true,
    }
    ,
    password : {
        type : String,
        trim : true,
        required : true,
    }
    ,
    phone : {
        type : Number,
        trim : true,
        required : true,
    }
    ,
    role : {
        type : String,
        default : "student",
        enum : ["student", "faculty", "admin"]
    }
    ,
    cart : [{
        itemName : {
            type : String
        }
        ,
        price : {
            type : String
        }
        ,
        units : {
            type : String
        }
        ,
        date : {
            type : String,
            default : new Date().toLocaleDateString()
        }
        ,
        time : {
            type : String,
            default : new Date().toLocaleTimeString() 
        }
    }]

 
})

const SignUp = mongoose.model("Signup", signUpSchema)

module.exports = SignUp;
