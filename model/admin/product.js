const mongoose=require('mongoose')
const categoryModel=require("../../model/admin/category")
const brandModel=require("../../model/admin/brands")

const productShema=new mongoose.Schema({
    name:{
        type:String,
        require
    },
    category:{
        type:mongoose.Types.ObjectId,
        ref:'category',
        require,
    },
    brand:{
        type:mongoose.Types.ObjectId,
        ref:'brands',
        require:true
    },
    initialPrice:Number,
    price:{
        type:Number,
        require
    },
    color:{
        type:String,
        require
    },
    referenceNumber:{
        type:Number,
        require
    },
    caseMaterial:{
        type:String,
        require
    },
    waterResistance:{
        type:String,
        require
    },
    movement:{
        type:String,
        require
    },
    warranty:{
        type:String,
        require
    },
    strapMaterial:{
        type:String,
        require
    },
    thumbnail:{
        type:String,
        require
    },
    frontImage:{
        type:String,
        require
    },
    images:[String],
    stock:Number,
    listed:{type:Boolean,default:true},

})

const productModel=new mongoose.model('products',productShema)

module.exports=productModel