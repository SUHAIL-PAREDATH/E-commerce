const express=require('express');
const { get } = require('mongoose');
const router=express.Router();
const signIn=require("../controller/admin/signIn")
// const signup=require("../controller/admin/signup")
const sessionCheck=require("../middleware/admin/sessionCheck")


router.
route('/')
.get(signIn.getSignIn)
.post(signIn.postSignIn)

router.
route('/index')
.get(signIn.viewIndex)



// router.
// route('/signup')
// .get(signup.view)
// .post(signup.getSignUp)

module.exports=router;