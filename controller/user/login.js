
const bcrypt=require("bcrypt")
const User=require('../../model/user/userSchema')
module.exports={
    getLogin:(req,res)=>{
        try {
            if(req.session.userID){
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
        const inputPassword=req.body.password
        const userFind=await User.findOne({email:inputEmail})
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
                  documentTitle: "User Sign In | TIMELESS",
                  errorMessage: "Incorrect Password",
                });
              }
            } else {
              res.render("user/login", {
                documentTitle: "User Sign In | TIMELESS",
                errorMessage: "Unauthorized User",
              });
            }
          } else {
            res.render("user/login", {
              documentTitle: "User Sign In | TIMELESS",
              errorMessage: "User not found",
            });
        }
      } catch (error) {
        console.log("Error signing in user: " + error);
      }
    },
}

