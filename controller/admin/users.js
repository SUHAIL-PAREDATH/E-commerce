const session = require("express-session")
const { findById, findByIdAndUpdate }=require("../../model/admin/details")
const userModel=require("../../model/user/userSchema")

exports.getUser=async(req,res)=>{
    try {
        const allUsers=await userModel.find().sort({fname:-1})
        res.render("admin/users",{
            session:req.session.admin,
            allUsers,
            documentTitle: "Customer Management"
        })
        

    } catch (error) {
        console.log("Error listing all users: " + error);
    }
}
exports.changeAccess=async(req,res)=>{
    try {
        let currentAccess=req.body.currentAccess
        currentAccess=JSON.parse(currentAccess);
        currentAccess=!currentAccess;
        await userModel.findByIdAndUpdate(req.body.userId,{
            access:currentAccess,
        });
        res.json({
            data:{newAccess : currentAccess},
        })
        
        
    } catch (error) {
        console.log("Error Changing User Access :" + error);
    }

    
}
