const mongoose = require('mongoose')

const tempCart = new mongoose.Schema({
    cart_number : {
        type : Number,
        default : Math.trunc(Math.random()*789789789)
    }
    ,
    user : {
        type : mongoose.Schema.ObjectId,
        ref : 'SignUp'
    }
    ,
    payment : {
        type : String,
        default : 'pending',
        enum : ['pending', 'sucessfull', 'failed']
    }
    ,
    cartItems : [{
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
    grossBill : {
        type : String
    }
    ,
    tax : {
        type : String
    }
    ,
    delivery : {
        type : String
    }
    ,
    platformFee : {
        type : String
    }
    ,
    netBill : {
        type : String
    }
})

const Cart = mongoose.model('Cart', tempCart)

module.exports = Cart;
