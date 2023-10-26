const express=require('express')
const router=express.Router();
const register=require('../controller/user/register')
const login=require('../controller/user/login')
const logOut=require('../controller/user/logOut')
const sessionCheck=require('../middleware/user/sessionCheck')
const cart= require('../controller/user/cart')
const wishlist=require('../controller/user/wishlist')
const checkout=require('../controller/user/checkout')
const profile=require("../controller/user/profile")


// ================LOGIN====================== 

router.
route('/login',)
.get(login.getLogin)
.post(login.postLogin)

// =================SIGNUP=====================
router.
route('/register',)
.get(register.getRegister)
.post(register.postRegister)


router.get('/register/reSendOTP',register.reSendOTP)
// =================OTP========================

router.
route('/otp',)
.get(register.getOTP)
.post(register.postOTP)

// =================logOUt======================

router.get('/logOut',sessionCheck,logOut.logOut)

// ================cart=========================

router
.route('/cart')
.get(sessionCheck,cart.viewCart)
.post(sessionCheck,cart.addToCart)
.delete(sessionCheck,cart.removeProduct)
.put(sessionCheck,cart.countChange)


// ===============wish list======================
router
.route("/wishlist")
.get(sessionCheck,wishlist.viewAll)
.patch(wishlist.addOrRemove)
.delete(wishlist.remove)

// =============profile=========================

router
.route("/profile")
.get(profile.viewPage)


// ===============check OUt======================

router
.route('/cart/checkout')
.get(sessionCheck,checkout.viewPage)
module.exports=router;