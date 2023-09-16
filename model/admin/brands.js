const mongoose=require('mongoose')

const brandSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    updatedBy:String
})

const brand=mongoose.model("brands",brandSchema)

module.exports=brand