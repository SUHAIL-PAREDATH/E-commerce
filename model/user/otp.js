const mongoose=require('mongoose')
const Schema=mongoose.Schema;

mongoose.set('strictQuery',false)

const otpSchema=new Schema({
    otp:{
        type:Number,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    expiresAt:{
        type:Date,
        default:Date.now,
        require:true,
        expires:55,
    }
});

const otp=mongoose.model('otp',otpSchema)

module.exports=otp;