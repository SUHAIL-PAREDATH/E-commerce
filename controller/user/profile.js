exports.viewPage=async(req,res)=>{
    try {
        res.render("user/partials/profile")
    } catch (error) {
        
    }
}