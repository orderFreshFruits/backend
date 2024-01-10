const express = require('express')
const accountOpeningController = require('./../controller/accout.opening.controller')
const router = express.Router()

router.route('/signup').post(accountOpeningController.SignupTheUser)
router.route('/login').post(accountOpeningController.Login)
router.route('/auto-login').get(accountOpeningController.autoLoginNavigation)
router.route('/logout').get(accountOpeningController.Logout)
router.route('/forgot-password').post(accountOpeningController.forgotPassword)

router.route('/cart').post(accountOpeningController.cart)
router.route('/empty-cart').get(accountOpeningController.emptyCartOnModifybtn)
router.route('/pay').post(accountOpeningController.payments)
router.route('/pay/validate').post(accountOpeningController.validatingPayments)
router.route('/pay/validate-subs').post(accountOpeningController.validatingPaymentsFORSUBSCRIPTION)
router.route('/check-sub-active').get(accountOpeningController.subscriptionActiveOrNotSendtoUI)


router.route('/temp-cart').post(accountOpeningController.temporaryCartStoringOnCurrentOrder)
// router.route('/pay-approve').get(accountOpeningController.approvingPayments, accountOpeningController.placingOrderAfterPayment)
router.route('/pre-orders').get(accountOpeningController.displayPreOrders)
router.route('/vendors-list').get(accountOpeningController.sendingTomorrowOrdersToVendorPanel)
router.route('/streak').get(accountOpeningController.userStreakAndHealthMeasuring)
router.route('/reset-streak').get(accountOpeningController.resetStreakCountAndAddingPrizeWinDay)
router.route('/ticket').post(accountOpeningController.raisingTicket)





module.exports = router