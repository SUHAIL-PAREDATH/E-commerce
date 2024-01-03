const Admin=require("../../model/admin/details")
const bcrypt=require("bcrypt")

exports.getSignIn=(req,res)=>{
    try{
        if(req.session.Admin){
            res.redirect("/") 
     }else{
        res.render("admin/login",{
            documentTitle:"Admin Sign in",
            admin : true,
            signIn : false,
        })
     }
       

    }catch(error){
console.log("Error rendering admin signin Page: " + error);
    }
};
exports.postSignIn=async(req,res)=>{
    try{
        const inputEmail=req.body.email.toLowerCase();
        const inputPassword=req.body.password;
        const adminFind=await Admin.findOne({email:inputEmail});
        if(adminFind){
            const hashedCheck=await bcrypt.compare(
                inputPassword,
                adminFind.password
            );
            if(hashedCheck){
                req.session.admin=req.body.email;
                console.log("admin success")
                res.redirect("/admin/index")
            }else{
                res.render('admin/login',{
                    documentTitle: "Admin Sign In",
                    errorMessage: "Incorrect Password",
                    admin:true
                })
            }
        }else{
            res.render('admin/login',{
                documentTitle: "Admin Sign In",
                errorMessage: "Incorrect email",
                })
              }

    }catch(error){
        console.log("error on admin signin"+error);
    }
}




