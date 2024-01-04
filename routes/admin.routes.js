const express = require('express')
const adminController = require("./../controller/admin.panel.controller")
router = express.Router()

router.route('/pack-these-orders').get(adminController.sendingOrdersToBePackedToAdminPanel)
router.route('/daily-rev').get(adminController.totalDailyRevenue)

module.exports = router