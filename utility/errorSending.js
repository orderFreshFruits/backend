class errorSending{
    error(res,status,msg,code){
        res.status(code).send({
            status : status,
            data : {
                msg : msg
            }
        })
    }
}

const errorSend = new errorSending()

module.exports = errorSend;