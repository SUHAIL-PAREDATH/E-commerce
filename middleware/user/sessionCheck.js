const sessionCheck=(req,res,next)=>{
    if(req.session.userID){
        next()
    }else{
        res.redirect('/login')
    }
}
module.exports=sessionCheck;