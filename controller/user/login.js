
const bcrypt=require("bcrypt")
const User=require('../../model/user/userSchema')
module.exports={
    getLogin:async(req,res)=>{
        try {
          const user=await User.findById(req.session.userID)
         
            if(req.session.userID&& user.access===true){
                res.redirect("/")
            }else{
                res.render("user/login",{
                    documentTitle: "User Sign In ",
                    session: null,
                });
            }
        } catch (error) {
            console.log("Error rendering user signin page: " + error);
        }
    },
    
    postLogin:async(req,res)=>{
      try {
        const inputEmail=req.body.email.toLowerCase();
        console.log(inputEmail);
        const inputPassword=req.body.password
        const userFind=await User.findOne({email:inputEmail})
console.log(req.session.userID);
        if(!userFind){
          console.log("-------------");
          res.render("user/login", {
            documentTitle: "User Sign In",
            errorMessage: "user not found",
          });
        }else{
          if (userFind) {
            const hashedCheck = await bcrypt.compare(
              inputPassword,
              userFind.password
            );  
            if (userFind.access == true) {
              if (hashedCheck) {
                req.session.userID = userFind._id;
                res.redirect("/");
              } else {
                res.render("user/login", {
                  documentTitle: "User Sign In",
                  errorMessage: "Incorrect Password",
                });
              }
            } else {
              res.render("user/login", {
                documentTitle: "User Sign In ",
                errorMessage: "Unauthorized User",
              });
            }
          } else {
            res.render("user/login", {
              documentTitle: "User Sign In ",
              errorMessage: "User not found",
            });
        }
        }

        
      } catch (error) {
        console.log("Error signing in user: " + error);
      }
    },
}

