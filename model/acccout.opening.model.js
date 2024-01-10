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
        enum : ["student", "faculty", "admin", "vendor"]
    }
    ,
    secret : {
        type : String
    }
    ,
    streakCount : {
        type : Number,
        default: 0
    }
    ,
    ordersPlaced : [{
        orderDelivered : {
            type : Boolean,
            default : false
        }
        ,
        orderid : {
            type : String
        }
        ,
        orderElements : [{
            name : {
                type : String
            }
            ,
            price : {
                type : String
            }
            ,
            weight : {
                type : String
            }
            ,
            units : {
                type : Number
            }
        }]
        ,
        prevOrders : [{
            orderDelivered : {
                type : Boolean,
            }
            ,
            orderid : {
                type : String
            }
            ,
            orderElements : [{
                name : {
                    type : String
                }
                ,
                price : {
                    type : String
                }
                ,
                weight : {
                    type : String
                }
                ,
                units : {
                    type : Number
                }
            }]
        }]
        ,
        grossBill : {
            type : String
        }
        ,
        tax : {
            type : String
        }
        ,
        delivery : {
            type : Number,
            default : 5
        }
        ,
        platformFee : {
            type : Number,
            default : 5
        }
        ,
        netBill : {
            type : String,
        }
    }]
    ,
    subscriptionActive : [{
        plan : {
            type : String,
            default : ''
        }
        ,
        startDate : {
            type : String
        }
        ,
        mature : {
            type : String
        }
    }]

 
})

const SignUp = mongoose.model("Signup", signUpSchema)

module.exports = SignUp;
