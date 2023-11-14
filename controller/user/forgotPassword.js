const userModel=require('../../model/user/userSchema')
const otpModel=require('../../model/user/otp')
const nodemailer=require('nodemailer')
const bcrypt=require('bcrypt')

exports.viewPage=async(req,res)=>{
    try {
        res.render("user/newPassword ",{
            documentTitle:"Forget password"
        })
    } catch (error) {
        console.log("error rendering forgot password page"+error)
    }
}