const mongoose=require('mongoose')

const adminSchema=new mongoose.Schema({
    
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    name:{
        type:String,
    },

});

const Admin=mongoose.model("AdminDetails",adminSchema);

module.exports=Admin;