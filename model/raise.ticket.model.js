const mongoose = require('mongoose')

const raiseTicket = new mongoose.Schema({
    user : {
        type : mongoose.Schema.ObjectId,
        ref : 'Signup'
    }
    ,
    ticket : [{
        ticket_heading : {
            type : String
        }
        ,
        ticket_des : {
            type : String
        }
        ,
        ticket_status : {
            type : String,
            enum : ["resolved", "waiting"],
            default : 'waiting'
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


const Ticket = mongoose.model('Ticket', raiseTicket)

module.exports = Ticket;
