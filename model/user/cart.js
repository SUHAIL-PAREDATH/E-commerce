const mongoose=require('mongoose')

const cartShema=new mongoose.Schema({
    customer:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    totalPrice:Number,
    totalQuantity:{
        type:Number,
        default:0
    },
    products:[
        {
            name:{
                type:mongoose.Types.ObjectId,
                ref:"products"
            },
            quantity:{
                type:Number,
                default:1,
                min:1
            },
            price:Number
        }
    ]
})

const cartModel=mongoose.model("Cart",cartShema)

module.exports=cartModel;