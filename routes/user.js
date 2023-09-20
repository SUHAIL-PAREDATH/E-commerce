const express=require('express')
const router=express.Router();
const landingPage=require('../controller/index/landingPage')
const register=require('../controller/user/register')
const login=require('../controller/user/login')
const logOut=require('../controller/user/logOut')
const sessionCheck=require('../middleware/user/sessionCheck')

router.
route('/')
.get(landingPage.view)

// ==============LOGIN============ 

router.
route('/login',)
.get(login.getLogin)
.post(login.postLogin)

// =============SIGNUP===========
router.
route('/register',)
.get(register.getRegister)
.post(register.postRegister)


router.get('/register/reSendOTP',register.reSendOTP)
// =============OTP==============

router.
route('/otp',)
.get(register.getOTP)
.post(register.postOTP)

// ============logOUt==============

router.get('/logOut',sessionCheck,logOut.logOut)

module.exports=router;