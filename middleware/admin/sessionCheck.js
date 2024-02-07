const sessionCheck=(req,res,next)=>{
    if(req.session.admin){
        next()

    }else{
        res.redirect("/admin/login")
    }
}
module.exports=sessionCheck