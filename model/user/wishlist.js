const mongoose=require("mongoose") 
const wishlistShema=new mongoose.Schema({
    customer:{
        type:mongoose.Types.ObjectId,
        ref:"User",

    },
    products:[
        {
            type:mongoose.Types.ObjectId,
            ref:"products",
        }
    ]

})

const wishlistModel=mongoose.model("Whishlist",wishlistShema)

module.exports=wishlistModel