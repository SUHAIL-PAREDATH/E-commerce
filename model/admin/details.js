const mongoose=require('mongoose')

const adminSchema=new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },

});

const Admin=mongoose.model("AdminDetails",adminSchema);

module.exports=Admin;