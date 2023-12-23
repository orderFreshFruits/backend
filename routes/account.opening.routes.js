const express = require('express')
const accountOpeningController = require('./../controller/accout.opening.controller')
const router = express.Router()

router.route('/signup').post(accountOpeningController.SignupTheUser)
router.route('/login').post(accountOpeningController.Login)
router.route('/cart').post(accountOpeningController.cart)
router.route('/empty-cart').get(accountOpeningController.emptyCartOnModifybtn)
router.route('/pay').get(accountOpeningController.payments)


module.exports = router