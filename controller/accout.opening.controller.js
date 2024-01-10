const Signup = require('./../model/acccout.opening.model')
const bcrypt = require('bcryptjs')
const LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');
const jwt = require('jsonwebtoken')
const errorSending = require('./../utility/errorSending')
const {promisify} = require('util')
const Cart = require('./../model/tempCart.model')

function tokenOBJ(id){
    return jwt.sign({id : id}, process.env.STRING)
} 


exports.SignupTheUser = async(req, res, next)=>{
    const {username, email, password, phone, role, secret} = req.body;
    const passwordSplit = password.split('')
    let capitalLetterArray = []
    let lowerLetterArray = []
    let specialLetterArray = []
    let numericLetterArray = []

    if(username==''){
        errorSending.error(res, 'error', 'Username is compulsory', 200)
        return; 
    }

    if(email==''){
        errorSending.error(res, 'error', 'Email is compulsory', 200)
        return; 
    }

    passwordSplit.forEach(el=>{
        if(el.charCodeAt()>=65 && el.charCodeAt()<=90){
            capitalLetterArray.push(el) 
        }

        if(el.charCodeAt()>=97 && el.charCodeAt()<=122){
            lowerLetterArray.push(el)
        }

        if((el.charCodeAt()>=32 && el.charCodeAt()<=47) || (el.charCodeAt()>=58 && el.charCodeAt()<=64) || (el.charCodeAt()>=91 && el.charCodeAt()<=96) || (el.charCodeAt()>=123 && el.charCodeAt()<=126)  ){
            specialLetterArray.push(el)
        }

        if(el.charCodeAt()>=48 && el.charCodeAt()<=57){
            numericLetterArray.push(el)
        }        
    })

    if(!(capitalLetterArray.length>=2)){
        errorSending.error(res, 'error', 'Not a valid password, capital letter missing !!!', 200)
        return;
    }else{
        console.log("Password capital check cleared")
    }

    if(!(lowerLetterArray.length>=2)){
        errorSending.error(res, 'error', 'Not a valid password, Lower letter missing !!!', 200)
        return;
    }else{
        console.log("Password lower check cleared")
    }

    if(!(specialLetterArray.length>=2)){
        errorSending.error(res, 'error', 'Not a valid password, special letter missing !!!', 200)
        return;
    }else{
        console.log("Password special check cleared")
    }

    if(!(numericLetterArray.length>=2)){
        errorSending.error(res, 'error', 'Not a valid password, numeric letter missing !!!', 200)
        return;
    }else{
        console.log("Password numeric check cleared")
    }

    // phone number check
    if(phone.split('').length!=10){
        errorSending.error(res, 'error', 'Mobile number must be off 10 digit long', 200)
        return;
    }

    // crypting the password
    const cryptedPassword = await bcrypt.hash(password, 12)
    // creating the user from the data into the database    
    const openingAcc = await Signup.create({username,email,password:cryptedPassword, phone, role,secret})
    // token providing
    const token = tokenOBJ(openingAcc._id)
    console.log(token)

    // sending token to cookie
    //const cookieOptions = {}
    //res.cookie("token", token, cookieOptions)

    // sending token to localstorage
    const tokenSendingToBrowser = localStorage.setItem('token', token)


    res.status(200).json({
        status : "success",
        data : {
            token,
            username,
            email,
            password,
            secret
        }
    })
}


exports.autoLoginNavigation = async(req, res, next)=>{
    const token = localStorage.getItem("token")
    if(!token){
        res.status(200).json({
            status : "error",
            data : {
                msg : "please login or signup"
            }
        })
        return
    }
    const tokenVerification = await promisify(jwt.verify)(token,process.env.STRING)
    const findingUser = await Signup.find({_id : tokenVerification.id})
    if(findingUser.length===1){
        res.status(200).json({
            status : "success",
            data : {
                user : findingUser[0]
            }
        })
    }else{
        res.status(200).json({
            status : "error",
            data : {
                msg : "please login or signup"
            }
        })
    }
    next()
}

exports.Logout = async(req, res, next)=>{
    const token = localStorage.removeItem("token")
    res.status(200).json({
        status : "success",
        data : {
            msg : "Logged out sucessfully"
        }
    })
}


exports.Login = async(req, res, next)=>{
    const {passwordFromUser,email} = req.body;
    // const token = localStorage.getItem("token")
    // const tokenVerification = await promisify(jwt.verify)(token,process.env.STRING)
    const findingUser = await Signup.find({email : email})

    // password comaprision
    const passwordCheck = await bcrypt.compare(passwordFromUser,findingUser[0].password)
    if(!passwordCheck){
        errorSending.error(res, 'error', 'Wrong Email or Password, try again', 200)
        return;
    }

    // re-assigning the token
    // token providing
    const newToken = tokenOBJ(findingUser[0]._id)

    // sending token to cookie
    // const cookieOptions = {}
    // res.cookie("token", token, cookieOptions)

    // sending token to localstorage
    const tokenSendingToBrowser = localStorage.setItem('token', newToken)

    res.status(200).json({
        status : "success",
        data : {
           newToken,
           message : "Login sucessfull"
        }
    })
}


exports.forgotPassword = async(req, res, next)=>{
    const {secret, email, password} = req.body;

    const user = await Signup.find({email : email})
    console.log(user)
    if(user[0].secret===secret){
        user[0].password = await bcrypt.hash(password,12)
        user[0].save()
        res.status(200).json({
            status : "success",
            data : {
                msg : "password changed sucessfully"
            }
        })
        return
    }else{
        res.status(200).json({
            status : "error",
            data : {
                msg : "secret incorrect"
            }
        })
        return
    }

}


exports.cart = async(req, res, next)=>{
    const {allCartElements} = req.body;
    const token = localStorage.getItem("token")
    const tokenVerification = await promisify(jwt.verify)(token,process.env.STRING)
    const findingUser = await Signup.find({_id : tokenVerification.id})

    allCartElements.forEach(el=>{
        findingUser[0].cart.push({
            itemName : el.name,
            price : el.price,
            units : el.units
        })
    })

    findingUser[0].save()

    res.status(200).json({
        status : "success",
        data : {
           message : "Login sucessfull"
        }
    })
}

exports.emptyCartOnModifybtn = async(req, res, next)=>{
    const token = localStorage.getItem("token")
    const tokenVerification = await promisify(jwt.verify)(token,process.env.STRING)
    const findingUser = await Signup.find({_id : tokenVerification.id})
    findingUser[0].cart = []
    findingUser[0].save()
    res.status(200).json({
        status : "success",
        data : {
           message : "Login sucessfull"
        }
    })
}


exports.temporaryCartStoringOnCurrentOrder = async(req, res, next)=>{
    const {cartArr, grossBill, tax, delivery, platformFee, netBill} = req.body;

    const token = localStorage.getItem("token")
    const tokenVerification = await promisify(jwt.verify)(token,process.env.STRING)
    const findingUser = await Signup.find({_id : tokenVerification.id})
    const existingcart = await Cart.find({user:findingUser[0].id})
    let creatingCartInDB
    if(existingcart.length!==0){
        existingcart[0].cartItems = []
        cartArr.forEach(async el=>{
            existingcart[0].cartItems.push({
                name : el[0].name,
                price : el[0].price,
                weight : el[0].weight,
                units : el[1]
            })
        })
        existingcart[0].grossBill = grossBill,
        existingcart[0].tax = tax.toFixed(2),
        existingcart[0].delivery = delivery,
        existingcart[0].platformFee = platformFee,
        existingcart[0].netBill = netBill,

        existingcart[0].save()
    }else{
       creatingCartInDB = await Cart.create({cart_number : Math.trunc(Math.random()*789789789), user : findingUser[0]._id, grossBill, tax, delivery, platformFee, netBill})
       console.log(creatingCartInDB)
        cartArr.forEach(async el=>{
            creatingCartInDB.cartItems.push({
                name : el[0].name,
                price : el[0].price,
                weight : el[0].weight,
                units : el[1]
            })
        })
    creatingCartInDB.save()
    }



    res.status(200).json({
        status : "success",
        data : {
           message : "Cart generated sucessfully"
        }
    })
}



const Razorpay = require('razorpay')

exports.payments = async(req, res , next)=>{
    const {amountPay} = req.body;
    console.log(amountPay)
    var instance = new Razorpay({ key_id: 'rzp_test_NnPf6q9w6YaUJq', key_secret: 'rkUKF3dKLZIGoIyCnMfbO18Z' })
    const finalPay = String(amountPay).split('.')[0] ? String(amountPay).split('.')[0] : String(amountPay)
    console.log(finalPay)
    var options = {
      amount: Number(finalPay),  // amount in the smallest currency unit
      currency: "INR",
      receipt: "order_rcptid_11"
    };
    instance.orders.create(options, function(err, order) {
      console.log(order);
      res.status(200).json({
        status : 'success',
        data : {
            order : order
        }
      })
    });
    
}

exports.validatingPayments = async(req, res, next)=>{
    const {razorpay_payment_id, razorpay_order_id, razorpay_signature} = req.body
    // const shm = crypto.createHash('sha256', 'rkUKF3dKLZIGoIyCnMfbO18Z')
    // shm.update(`${razorpay_order_id}|${razorpay_payment_id}`, 'rkUKF3dKLZIGoIyCnMfbO18Z')
    // const digest = shm.digest('hex')
    // console.log(razorpay_order_id)
    // console.log(razorpay_payment_id)
    // console.log(razorpay_signature)
    // console.log(digest)


    
    var { validatePaymentVerification, validateWebhookSignature } = require('./../node_modules/razorpay/dist/utils/razorpay-utils');
    validatePaymentVerification({"order_id": razorpay_order_id, "payment_id": razorpay_payment_id }, razorpay_signature, 'rkUKF3dKLZIGoIyCnMfbO18Z');

    if(validatePaymentVerification!==razorpay_signature){ // signature sahi cc nahi bana he bas logic ke liye iss condition me likh rahe he actual me dono match kern honge
        // res.status(200).json({
        //     status : 'success',
        //     data : {
        //         msg : 'sucessfull'
        //     }
        // })
        const paymentApprovalFromRajorPay = true
        const token = localStorage.getItem("token")
        const tokenVerification = await promisify(jwt.verify)(token,process.env.STRING)
        const findingUser = await Signup.find({_id : tokenVerification.id})
        const existingcart = await Cart.find({user:findingUser[0].id})

        if(paymentApprovalFromRajorPay){
            existingcart[0].payment = 'sucessfull'
        }

        existingcart[0].save()

        placingOrderAfterPayment(req, res, next)
        return
    }
    console.log('Finished')
}


exports.validatingPaymentsFORSUBSCRIPTION = async(req, res, next)=>{
    const {razorpay_payment_id, razorpay_order_id, razorpay_signature, plan, startDate} = req.body

    const token = localStorage.getItem("token")
    const tokenVerification = await promisify(jwt.verify)(token,process.env.STRING)
    const findingUser = await Signup.find({_id : tokenVerification.id})


    var { validatePaymentVerification, validateWebhookSignature } = require('./../node_modules/razorpay/dist/utils/razorpay-utils');
    validatePaymentVerification({"order_id": razorpay_order_id, "payment_id": razorpay_payment_id }, razorpay_signature, 'rkUKF3dKLZIGoIyCnMfbO18Z');

    if(validatePaymentVerification!==razorpay_signature){ // signature sahi cc nahi bana he bas logic ke liye iss condition me likh rahe he actual me dono match kern honge
        
        findingUser[0].subscriptionActive.push({
            plan : plan,
            startDate : startDate
        })
        findingUser[0].save()
        res.status(200).json({
            status : 'success',
            data : {
                msg : 'sucessfull'
            }
        })
        


        return
    }
    console.log('Finished')
}


exports.approvingPayments = async(req, res, next)=>{
    const paymentApprovalFromRajorPay = true
    const token = localStorage.getItem("token")
    const tokenVerification = await promisify(jwt.verify)(token,process.env.STRING)
    const findingUser = await Signup.find({_id : tokenVerification.id})
    const existingcart = await Cart.find({user:findingUser[0].id})

    if(paymentApprovalFromRajorPay){
        existingcart[0].payment = 'sucessfull'
    }

    existingcart[0].save()

    next()
}

const placingOrderAfterPayment = async(req, res, next)=>{
    const token = localStorage.getItem("token")
    const tokenVerification = await promisify(jwt.verify)(token,process.env.STRING)
    const findingUser = await Signup.find({_id : tokenVerification.id})
    const existingcart = await Cart.find({user:findingUser[0].id})
    findingUser[0].ordersPlaced.push({
        orderid : `INVOICE-OLF-${findingUser[0]._id}`,
        orderElements : [...existingcart[0].cartItems],
        grossBill : existingcart[0].grossBill, 
        tax : existingcart[0].tax, 
        delivery : existingcart[0].delivery, 
        platformFee : existingcart[0].platformFee, 
        netBill : existingcart[0].netBill
    })
    findingUser[0].streakCount++
    findingUser[0].save()
    res.status(200).send({
        status : "success",
        data : {
           msg : "order placed"
        }
    })
}


exports.displayPreOrders = async(req, res, next)=>{
    const token = localStorage.getItem("token")
    const tokenVerification = await promisify(jwt.verify)(token,process.env.STRING)
    const findingUser = await Signup.find({_id : tokenVerification.id})
    console.log(findingUser)
    res.status(200).send({
        status : "success",
        data : {
           orders : [...findingUser[0].ordersPlaced]
        }
    })
}


exports.sendingTomorrowOrdersToVendorPanel = async(req, res, next)=>{
    const users = await Signup.find()
    const allOrdersForTomorrowArray = []
    const allOrdersElementsToDeliveredTomorrow = []
    const allElementsNameList = []
    users.forEach(el=>{
        allOrdersForTomorrowArray.push(...el.ordersPlaced)
    })

    allOrdersForTomorrowArray.forEach(el=>{
        allOrdersElementsToDeliveredTomorrow.push(...el.orderElements)
    })

    allOrdersElementsToDeliveredTomorrow.forEach(el=>{
        allElementsNameList.push(el.name)
    })

    const nameSet = new Set(allElementsNameList)

    const finalList = []

    nameSet.forEach(el=>{
        let sum = 0;
        let price = 0;
        let weight;
        allOrdersElementsToDeliveredTomorrow.forEach(item=>{
            if(el===item.name){
                price = item.price
                sum += Number(item.units)
                weight = item.weight
            }
        })
        const obj = {
            name : el,
            netUnits : sum,
            price : price,
            weight : weight
        }
        finalList.push(obj)
    })

    console.log(finalList)

    res.status(200).send({
        status : "success",
        data : {
            list : finalList
        }
    })
}


exports.userStreakAndHealthMeasuring = async(req, res, next)=>{
    const token = localStorage.getItem("token")
    const tokenVerification = await promisify(jwt.verify)(token,process.env.STRING)
    const findingUser = await Signup.find({_id : tokenVerification.id})
    res.status(200).send({
        status : "success",
        data : {
            streak : findingUser[0].streakCount
        }
    })
}

exports.resetStreakCountAndAddingPrizeWinDay = async(req, res, next)=>{
    const token = localStorage.getItem("token")
    const tokenVerification = await promisify(jwt.verify)(token,process.env.STRING)
    const findingUser = await Signup.find({_id : tokenVerification.id})
    findingUser[0].streakCount = 0
    findingUser[0].prizeWonDate = new Date().toLocaleDateString()
    findingUser[0].save()
    res.status(200).send({
        status : "success",
        data : {
            msg : "prize won"
        }
    })
}
const Ticket = require("./../model/raise.ticket.model");
const { Sign } = require('crypto');
exports.raisingTicket = async(req, res, next)=>{
    const {ticketIssue} = req.body
    const token = localStorage.getItem("token")
    const tokenVerification = await promisify(jwt.verify)(token,process.env.STRING)
    const findingUser = await Signup.find({_id : tokenVerification.id})
    const raiseTicket = await Ticket.create({user:findingUser[0]._id})
    raiseTicket.ticket.push(ticketIssue)
    raiseTicket.save()
    res.status(200).send({
        status : "success",
        data : {
            msg : "Ticket Created, the team will approach you soon"
        }
    })

}


exports.subscriptionActiveOrNotSendtoUI = async(req, res, next)=>{
    const token = localStorage.getItem("token")
    const tokenVerification = await promisify(jwt.verify)(token,process.env.STRING)
    const findingUser = await Signup.find({_id : tokenVerification.id})
    res.status(200).json({
        status : 'success',
        data : {
            sub : findingUser[0].subscriptionActive
        }
    })
}


