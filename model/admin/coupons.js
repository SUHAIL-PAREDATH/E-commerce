const mongoose=require("mongoose")

const couponShema=new mongoose.Schema({
    name:String,
    code:String,
    discount:Date,
    startingDate:Date,
    qty:Number,
    expiryDate:Date,
    active:{
        type:Boolean,
        default:true,
    }
});

const couponModel=mongoose.model("Coupon",couponShema)

module.exports=couponModel;

