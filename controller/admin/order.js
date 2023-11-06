const orderModel=require("../../model/user/order")
const productModel=require("../../model/admin/product")
const moment=require('moment')

exports.viewPage=async(req,res)=>{
    try {
        const allOrders=await orderModel
            .find()
            .populate("customer","name email")
            .populate("couponUsed","name")
            .populate("summary.product","category name brand price")
            .sort({_id:-1});
        res.render("admin/order",{
            allOrders,
            moment,
            session:req.session.admin
            
        })
    } catch (error) {
        res.redirect("/admin/index")
        console.log("error on rendering order page :" + error)
    }
}

exports.detailsPage=async(req,res)=>{
    try {
        const orderID=req.params.id;
        const currentOrder=await orderModel
            .findById(orderID)
            .populate("summary.product")
            .populate("couponUsed");
console.log(currentOrder.shippingAddress.pincode);
        res.render("admin/orderDetails",{
            session:req.session.admin,
            currentOrder,
            moment,
            documentTitle:"Order Details"
        })
    } catch (error) {
        res.redirect("/admin/index")
        console.log("error on rendering product detail page")
    }
}

exports.deliver=async(req,res)=>{
    try {
        await orderModel.findByIdAndUpdate(req.body.orderID,{
            $set:{
                delivered:true,
                deliveredOn:new Date(),
                status:"delivered"
            }
        });
        res.json({
            data:{delivered:1}
        })
    } catch (error) {
        res.redirect("/admin/dashboard")
        coonsole.log("erro on delivering product :" + error)
    }
}
exports.return=async(req,res)=>{
    try {
        await orderModel.findByIdAndUpdate(req.body.orderID,{
            $set:{
                returnedOn:new Date(),
                status:"returned",
                delivered:false
            }
        });
        const currentOrder=await orderModel
        .findById(req.body.orderID)

        currentOrder.summary.forEach(async(ele)=>{
            await productModel.updateOne({_id:ele.product},{$inc:{stock:ele.quantity}})
        });
        res.json({
            data:{returned:1},
        })
    } catch (error) {
        res.redirect("/admin/index")
        coonsole.log("erro on returning product :" + error)
    }
}

exports.cancelOrder=async(req,res)=>{
    try {
        const orderDetails=await orderModel.findById(req.params.id);
        const productIds=orderDetails.summary.map((order)=>order.product);
        const quantity=orderDetails.summary.map((order)=>order.quantity)
        const price=orderDetails.summary.map((order)=> order.totalPrice);

        for(let i=0;i<productIds.length;i++){
            await productModel.updateOne(
                { _id:productIds[i]},{$inc:{stock:quantity[i]}})

            await orderModel.findByIdAndUpdate(req.params.id,{
                $set:{
                    status:"Cancelled",
                    delivered:false,

                }
            })
            res.json({
                success:{
                    message:'cancelled'
                }
            })
        }
    } catch (error) {
        
    }
}