const express=require('express')
const router=express.Router();
const register=require('../controller/user/register')
const login=require('../controller/user/login')
const sessionCheck=require('../middleware/user/sessionCheck')


router.
route('/')
.get(register.getHome)


router.
route('/login',)
.get(login.getLogin)
.post(login.postLogin)


router.
route('/register',)
.get(register.getRegister)
.post(register.postRegister)

router.
route('/otp',)
.get(register.getOTP)
.post(register.postOTP)

module.exports=router;