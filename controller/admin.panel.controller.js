const Signup = require("./../model/acccout.opening.model")

exports.sendingOrdersToBePackedToAdminPanel = async(req, res, next)=>{
    const allUsers = await Signup.find()
    const listOfOrders = []
    allUsers.forEach(el=>{
        if(el.ordersPlaced.length!==0){
            listOfOrders.push([el.username, el.phone,[...el.ordersPlaced]])
        }
    })
    console.log(listOfOrders)
    res.status(200).send({
        status : "success",
        data : {
            list : listOfOrders
        }
    })
}


exports.totalDailyRevenue = async(req, res, next)=>{
    const allUsers = await Signup.find()
    const listOfOrders = []
    allUsers.forEach(el=>{
        if(el.ordersPlaced.length!==0){
            listOfOrders.push(...[...el.ordersPlaced])
        }
    })

    let sumOfGrossBill = 0;
    let deliveryAndPlatoformFeeCount = 0;
    listOfOrders.forEach(el=>{
        sumOfGrossBill+=Number(el.grossBill)
        deliveryAndPlatoformFeeCount++
    })

    let totalTaxCollected = 0.05 * sumOfGrossBill
    let deliveryFeeCollected = 5*deliveryAndPlatoformFeeCount
    let platFormFeeCollected = 2.5*deliveryAndPlatoformFeeCount

    let netRevenueCollected = sumOfGrossBill + totalTaxCollected + deliveryFeeCollected + platFormFeeCollected

    let GrossGateWayCharges = 0.02 * netRevenueCollected;
    let NetGateWayChargesWithTax = GrossGateWayCharges + GrossGateWayCharges * 0.18
    let TravelCharges = 250
    let packagingCharges = 100
    let vendorPayout = 750

    let netProfits = netRevenueCollected - NetGateWayChargesWithTax - TravelCharges - packagingCharges - vendorPayout

    const finalTodayRevenueDetials = {
        grossRevenue : sumOfGrossBill.toFixed(2),
        tax : totalTaxCollected.toFixed(2),
        delivery : deliveryFeeCollected.toFixed(2),
        platform : platFormFeeCollected.toFixed(2),
        netRevenue : netRevenueCollected.toFixed(2),
        gateway : NetGateWayChargesWithTax.toFixed(2),
        travel : TravelCharges.toFixed(2),
        packaging : packagingCharges.toFixed(2),
        vendorPay : vendorPayout.toFixed(2),
        profit : netProfits.toFixed(2)
    }

    console.log(sumOfGrossBill)
    res.status(200).send({
        status : "success",
        data : {
            payDetails : finalTodayRevenueDetials
        }
    })
}


exports.deliveringOrdersAndMoveToPrevorders = async(req, res, next)=>{
    // const {username,}
}