const sessionCheck=(req,res,next)=>{
    if(req.session.userID){
        next()
    }else{
        res.redirect('/register')
    }
}
module.exports=sessionCheck;