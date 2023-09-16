const mongoose=require('mongoose')
const { schema } = require('./details')

const categorySchema=new mongoose.Schema({
    name:{
        type:String,
        require:true,
        unique:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    updatedBy:String,
})
const category=mongoose.model('category',categorySchema)

module.exports=category;
