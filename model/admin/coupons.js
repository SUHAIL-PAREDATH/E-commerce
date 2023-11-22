const mongoose=require("mongoose")

const couponShema=new mongoose.Schema({
    name:{type:String,
        unique:true
    },
    code:{type:String,
        unique:true
    },
    discount:Number,
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

