const cartModel=require("../../model/user/cart")
const userModel=require("../../model/user/userSchema")
const orderModel=require("../../model/user/order");
const session = require("express-session");
const { default: mongoose } = require("mongoose");
const couponModel=require('../../model/admin/coupons')



exports.viewPage=async(req,res)=>{
    try {
        const currentUser=await userModel.findById(req.session.userID)
        console.log(currentUser.fname);
        const userCart=await cartModel.findOne({customer:req.session.userID}).populate("products.name");
        let products=userCart.products
        if(userCart.totalQuantity!=0){
            let allAddresses=await userModel.findById(req.session.userID)
            allAddresses=allAddresses.addresses;
            let defaultAddress=await userModel.aggregate([
                {$match:{_id:new mongoose.Types.ObjectId(req.session.userID)}},
                {$unwind:"$addresses"},
                {$match:{'address.primary':true}}              
            ]);
            let coupons=await couponModel.find()
            if(defaultAddress!=""){
                defaultAddress=defaultAddress[0].addresses;
            }else{
                defaultAddress=0
            }
            res.render("user/partials/checkout",{
                session:req.session.userID,
                defaultAddress,
                products,
                userCart,
                allAddresses,
                coupons,
                documentTitle:"checkout",
                currentUser
                
            })
        }else{
            res.redirect("/cart")
        }
    } catch (error) {
        res.redirect("/cart");
         console.log('error on rendering checkoutpage :'+error)
    }
}