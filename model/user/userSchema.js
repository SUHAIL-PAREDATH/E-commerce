const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    fname:String,
    lname:String,
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:String,
    cpassword:String,
    number:Number,
    addresses:[{
        building: String,
        address: String,
        pincode: Number,
        country: String,
        contactNumber: Number,
        primary: Boolean,
    }],
    photo: {
        type: String,
        default: "default_userPhoto.jpg",
      },
    access:{
        type:Boolean,
        default:true 
    },
    cart: {
        type: mongoose.Types.ObjectId,
        ref: "Cart",
      },
    wishlist:{
        type:mongoose.Types.ObjectId,
        ref:"Whishlist",
    },
    orders:[{
        type:mongoose.Types.ObjectId,
        ref:"Orders",
    },
    ],
    couponsUsed:[{
        type:mongoose.Types.ObjectId,
        ref:"Coupon",
    },
    ]

},{timestamps:true});
const Users=mongoose.model('User',userSchema)

module.exports =Users;
