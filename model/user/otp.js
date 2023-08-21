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
    expiration:{
        type:String,
        require:true
    }
});

const otp=mongoose.model('otp',otpSchema)

module.exports=otp;