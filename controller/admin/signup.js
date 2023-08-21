// const bcrypt=require('bcrypt');
// const Admin = require('../../model/admin/details')


// exports.view = async (req, res) => {
//     try {
//         res.render("admin/signUp")
//     } catch (error) {
        
//     }
// }

// exports.getSignUp= async (req,res)=>{{
//     const {email,password} = req.body

//     let user = await Admin.findOne({email:email})
   
//       const hashedPassword = await bcrypt.hash(password, 10);
//       user =  new Admin({
//         email: email,
//         password: hashedPassword,
//       });
//       await user.save();
// }
// }