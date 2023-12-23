const app = require('./app')
const dotenv = require('dotenv')
const mongoose = require("mongoose")

dotenv.config({path : "./environment/config.env"})

const server = app.listen(process.env.PORT, ()=>{
    console.log(`The Server is live on your PC at ${process.env.PORT} port`)
})

const DBCONNECTION = mongoose.connect(process.env.CONNECTION).then(el=>{
    console.log(`The Database is connected and start working at ${new Date().toLocaleTimeString()} ------- `)
})

