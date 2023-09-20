const mongoose=require('mongoose')

const bannerSchema=new mongoose.Schema({
    title:String,
    Image:String,
    description:String,
    url:String,
    videoURL:String,
    active:{
        type:Boolean,
        default:true
    },
    updatedBy:String
},
{timestamps:true});

const bannerModel=new mongoose.model('banners',bannerSchema)

module.exports=bannerModel;