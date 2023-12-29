const express = require('express')
const accountOpeningController = require('./../controller/accout.opening.controller')
const router = express.Router()

router.route('/signup').post(accountOpeningController.SignupTheUser)
router.route('/login').post(accountOpeningController.Login)
router.route('/cart').post(accountOpeningController.cart)
router.route('/empty-cart').get(accountOpeningController.emptyCartOnModifybtn)
router.route('/pay').get(accountOpeningController.payments)
router.route('/temp-cart').post(accountOpeningController.temporaryCartStoringOnCurrentOrder)
router.route('/pay-approve').get(accountOpeningController.approvingPayments, accountOpeningController.placingOrderAfterPayment)
router.route('/pre-orders').get(accountOpeningController.displayPreOrders)


module.exports = router