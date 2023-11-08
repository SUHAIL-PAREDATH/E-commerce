exports.logOut=(req,res)=>{
    try{
        req.session.destroy();
        res.redirect("/admin")
    }catch(error){
        console.log("Error signing out admin: " + error);
    }
}