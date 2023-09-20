exports.logOut=async(req,res)=>{
    try {
        req.session.destroy()
        res.redirect('/login')
    } catch (error) {
        console.log('Error in User Sign Out '+ error);
    }
}