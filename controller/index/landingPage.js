const userModel=require('../../model/user/userSchema')

exports.view =(req,res)=>{
        try {
          
          if(req.session.userID){
            console.log('hoooooooocccccccccccccccccccccccccccccccccccccccc')
            res.render("user/landingPage",{
            session:req.session.userID
            })
          }else{
            console.log('ooooooooooooooooooooooooooooooooooooooooooooooo');
            res.render("user/landingPage",{
              session:false        })
          }
        
        } catch (error) {
          console.log("error renderig using signup page" + error);
        }
        
      
}
    