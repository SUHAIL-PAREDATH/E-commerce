const { default: mongoose } = require('mongoose');
const userModel=require('../../model/user/userSchema')

exports.viewPage=async(req,res)=>{
    try {
        let userID=req.session.userID;
        let currentUser=await userModel.findById(userID) 
        let defaultAddress=await userModel.aggregate([
            {
                $match:{_id:new mongoose.Types.ObjectId(userID)}
            },
            {$unwind:"$addresses"},
            {$match:{"addresses.primary":true}}
    ])
        res.render("user/profile/profile",{
            documentTitle: "User Profile",
            currentUser,
            defaultAddress,
        })
    } catch (error) {
        res.redirect('/');
        console.log("error on rendering profile page:" + error)
    }
}
exports.updateUser=async(req,res)=>{
    try {
        const userID=req.session.userID
        const newName=req.body.fname;
        const lastName=req.body.lname;
        const filteredBody={fname:newName,lname:lastName}
        if(req.file){
            filteredBody.photo=req.file.filename;
        }
        await userModel.findByIdAndUpdate(userID,filteredBody);
        res.redirect('/profile')
    } catch (error) {
        res.redirect("/profile");
        console.log("error on profile upadtion;" + error)
    }
}