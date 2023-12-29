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
    const {username, email, password, phone, role} = req.body;
    const passwordSplit = password.split('')
    let capitalLetterArray = []
    let lowerLetterArray = []
    let specialLetterArray = []
    let numericLetterArray = []


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
    const openingAcc = await Signup.create({username,email,password:cryptedPassword, phone, role})
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
            password
        }
    })
}


exports.Login = async(req, res, next)=>{
    const {passwordFromUser,email} = req.body;
    const token = localStorage.getItem("token")
    const tokenVerification = await promisify(jwt.verify)(token,process.env.STRING)
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
    const tokenSendingToBrowser = localStorage.setItem('token', token)

    res.status(200).json({
        status : "success",
        data : {
           token,
           message : "Login sucessfull"
        }
    })
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



const razorpay = require('razorpay')

exports.payments = async(req, res , next)=>{
    var instance = new Razorpay({ key_id: 'rzp_test_9dMqp1eZ04kOKS', key_secret: 'Lw9dHvPENxPCxCb9yInxjay8' })

    var options = {
    amount: 50000,  // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11"
    };
    instance.orders.create(options, function(err, order) {
    console.log(order);
    });
    res.status(200).send({
        status : "success",
        data : {
           id : order.id
        }
    })
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

exports.placingOrderAfterPayment = async(req, res, next)=>{
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