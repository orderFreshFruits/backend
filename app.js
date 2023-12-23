const express = require("express")
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())

const accountOpeningRoute = require('./routes/account.opening.routes')
app.use('/api/v1/user', accountOpeningRoute)


module.exports = app