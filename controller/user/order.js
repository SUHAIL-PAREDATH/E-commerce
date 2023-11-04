const moment= require('moment')
const orderModel=require('../../model/user/order')
const productModel=require('../../model/admin/product')
const couponModel=require('../../model/admin/coupons')

exports.viewPage=async(req,res)=>{
    try {
        allOrders=await orderModel
            .find({customer:req.session.userID})
            .sort({_id:-1})
            .populate("customer")
            .populate("couponUsed")
            console.log(allOrders);
        res.render("user/partials/orders",{
            allOrders,
            moment,
            session:req.session.userID
        })
        
    } catch (error) {
        res.redirect('/');
        console.log("error on rendering order page")
    }
}

exports.details=async(req,res)=>{
    try {
        const currentOrder=await orderModel
        .findById(req.params.id)
        .populate("summary.product")
        .populate("couponUsed")
        .sort("");

        if(currentOrder){
            res.render("user/partials/orderDetails",{
                documentTitle: "Order Details",
                currentOrder,
                 moment,
            })
        }else {
            res.redirect("/pageNotFound");
          }
    } catch (error) {
        console.log("error on getting order detail page :"+error)
    }
}

exports.cancel=async(req,res)=>{
    try {
        const currentOrder=await orderModel
            .findById(req.params.id)
        await orderModel.findByIdAndUpdate(req.params.id,{
            $set:{
                status:'Cancelled',
                deliveredOn:null
            }
        })
        await couponModel.findByIdAndUpdate(currentOrder.couponUsed,{
            $inc:{qty:1}
        })
        currentOrder.summary.forEach(async(ele)=>{
            await productModel.updateOne({_id:ele.product},{$inc:{stock:ele.quantity}})
        });
        res.json({
            success:'cancelled'
        })
    } catch (error) {
        
    }
}

exports.return=async(req,res)=>{
    try {
        
        const currentOrder=await orderModel
            .findById(req.params.id)

            const deliverDate=new Date(currentOrder.deliveredOn);
            console.log(deliverDate.getTime());

            const currentDate=new Date();
            if(currentDate-deliverDate<7*24*60*60*1000){
                await orderModel.findByIdAndUpdate(req.params.id,{
                    $set:{
                        status:'return-requedted'
                    }
                })

                res.json({
                    success:'return'
                })
            }else{
                res.json({
                    success:'expired'
                })
            }
    } catch (error) {
        console.log("error on return order :"+error)
        
    }
}