const { render } = require("ejs");
const express = require("express");
const router = express.Router();
const Users = require("../../model/user/userSchema");
const NewOTP = require("../../model/user/otp");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
require("dotenv").config({ path: ".env" });
const { default: mongoose } = require("mongoose");
const otp = require("../../model/user/otp");
const cartModel=require("../../model/user/cart")
const wishlistModel=require("../../model/user/wishlist")


let msg = "";

module.exports = {

  getRegister: (req, res) => {
    try {
      if (req.session.tempOTP != false) {
        req.session.tempOTP = false;
        // console.log('Account creation OTP:'+req.session.tempOTP);
      }
      res.render("user/register");
    } catch (error) {
      console.log("error renderig using signup page" + error);
    }
  },

  postRegister: async (req, res) => {
    try{
        const hashedPassword=await bcrypt.hash(req.body.password,10)
        const newUserDetails={
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email.toLowerCase(),
            number: req.body.number,
            password: hashedPassword
        };
        req.session.newUserDetails=newUserDetails
        const inputEmail=req.body.email;
        const inputNumber=req.body.number;
        const emailCheck = await Users.findOne({ email: inputEmail });
        const numberCheck = await Users.findOne({ number: inputNumber });
        if(emailCheck||numberCheck){
            res.render('user/register',{
                documentTitle:'User Sign up',
                errorMessage:'user already existig'
            })
        }else{
            const tempOTP = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
            req.session.tempOTP = tempOTP;

            const newOTP=new NewOTP({
              email:inputEmail,
              otp:tempOTP
            })
            await newOTP.save()

            
            //Transporter
            const transporter = await nodemailer.createTransport({
                service: "gmail",
                auth: {
                  user: process.env.TRANSPORTER_USERNAME,
                  pass: process.env.TRANSPORTER_PASSWORD,
                },
              });

              //Mail options
              const mailOptions=await{
                from: process.env.TRANSPORTER_USERNAME,
                 to: inputEmail,
                 subject: "OTP Verification ",
                html: `<h1>OTP</h1></br><h2 style="text-color: red, font-weight: bold">${tempOTP}</h2></br><p>Enter the OTP to create account.</p>`,
              };
              //send mail
              await transporter.sendMail(mailOptions);
              console.log("Account creation OTP Sent: " + req.session.tempOTP);
              res.redirect('/otp')
        }
    }catch(error){
        console.log("Error signing up user: " + error);
    }
  },

  getOTP: (req, res) => {
    try{
      res.render("user/otp",{
        documentTitle:"OTP verification"
      })

    }catch(error){
      console.log("Error rendering OTP page:"+error);
    }
  },
  
  postOTP: async(req, res) => {
    try{
      
      // if(req.session.tempOTP){
      //   if(req.body.otp == req.session.tempOTP){
      //     console.log("============Account creatipn OTP deleted"+req.session.tempOTP);
      //     const newUserDetails=new Users(req.session.newUserDetails)

      //     newUserDetails.save();
      //     req.session.tempOTP=false;
      //     res.redirect("/login")
      //   }else{
      //     console.log("otp errorrrrrr");
      //     res.render("user/otp", {
            
      //       documentTitle: "OTP Verification ",
      //       errorMessage: "Invalid OTP",
      //     });
      //   }
      // }else {
      //   res.redirect("/register");
      // }

      const otpChecker=await otp.findOne({otp:req.body.otp})
      if(otpChecker){
        const newUserDetails=new Users(req.session.newUserDetails);
        newUserDetails.save();
        const existUserDetails=await Users.findOne({email:otpChecker.email})
        const userID=existUserDetails._id;

        const newCart=new cartModel({
          customer:new mongoose.Types.ObjectId(userID),
        });
        await Users.findByIdAndUpdate(userID,{
          $set: { cart:new mongoose.Types.ObjectId(newCart._id) },
        });
        await newCart.save();
  
        const newWishlist=new wishlistModel({
          customer:new mongoose.Types.ObjectId(userID)
        });
        await Users.findByIdAndUpdate(userID,{
          $set:{wishlist:new mongoose.Types.ObjectId(newWishlist._id)},
        });
        await newWishlist.save()

        res.redirect('/login')
      }else{
        res.render('users/otp',{
          documentTitle: "OTP Verification",
          errorMessage: "Invalid OTP",
          newUserDetails:null,
        })
      }
      
    }catch(error){
      console.log("Error verifying OTP: " + error);
    }
  },
  reSendOTP:async(req,res)=>{
    console.log("heeeeeeeeeeeeee");
    const inputEmail = req.session.inputEmail;
    
      if(inputEmail){
            const otp = `${Math.floor(1000+Math.random()*9000)}`
                  console.log(otp +'otp');
                  req.session.otp = otp;

                  const newOTP = new NewOTP({
                        email : inputEmail,
                        otp : otp,
                  });
                  await newOTP.save();
                   // creating transporter
                  let transporter = nodemailer.createTransport({
                        service:'Gmail',
                        auth: {
                              user : process.env.TRANSPORTER_USERNAME,
                              pass : process.env.TRANSPORTER_PASSWORD,
                        },
                  });
                  // mail options
                  let mailOptions = {
                        from:process.env.TRANSPORTER_USERNAME,
                        to: inputEmail,
                        subject : "OTP Verification | LAP4YOU eCommerce",
                        html: `<h1>OTP</h1></br><h2 style="text-color: red, font-weight: bold">${otp}</h2></br><p>Enter the OTP to create account.</p>`,
                  };

                  transporter.sendMail(mailOptions, (error, info)=> {
                        if(error){
                              console.log('error Occured : '+error);
                        } else{
                              console.log(`OTP sent successfully ${otp}`);
                              res.redirect('/otp');
                        }
                  });
      }
  }
};
