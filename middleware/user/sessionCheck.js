const sessionCheck=(req,res,next)=>{
    if(req.session.userID){
        nexr()
    }else{
        res.redirect('/register')
    }
}
module.exports=sessionCheck;