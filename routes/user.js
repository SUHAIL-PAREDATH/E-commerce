const express=require('express')
const router=express.Router();
const croppedImgupload=require('../utilities/croppedImgUpload')

const sessionCheck=require('../middleware/user/sessionCheck')
const objectIdCheck=require('../middleware/user/objectCheck')

const register=require('../controller/user/register')
const login=require('../controller/user/login')
const logOut=require('../controller/user/logOut')
const cart= require('../controller/user/cart')
const wishlist=require('../controller/user/wishlist')
const checkout=require('../controller/user/checkout')
const profile=require("../controller/user/profile")
const address=require('../controller/user/address')
const order=require("../controller/user/order")


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
.get(sessionCheck,profile.viewPage)
.post(sessionCheck,croppedImgupload.single("photo"),profile.updateUser)

// ===============addresses======================

router.get("/addresses",sessionCheck, address.viewPage)
router.post('/addresses/addNew',sessionCheck, address.addNew)
router.get('/addresses/delete',sessionCheck, address.deleteAddress)
router.get("/addresses/changeRole",sessionCheck, address.defultToggler)

// ===============check OUt======================

router
.route('/cart/checkout')
.get(sessionCheck,checkout.viewPage)
.put(sessionCheck,checkout.couponCheck)
.post(sessionCheck,checkout.checkout)

router.get("/cart/checkout/:id",checkout.result)

//call back from razor pay
router.post("/cart/checkout/:id",async(req,res)=>{
    const transactionID=req.params.id;
    console.log(transactionID)
    res.redirect(`/cart/checkout/${transactionID}`)
})

router.post("/cart/checkout/changeDefaultAddress",sessionCheck,checkout.defaultAddress)

// ====================Order======================

router
.route("/orders")
.get(order.viewPage)

router
.route("/orders/:id")
.get(sessionCheck,objectIdCheck, order.details)
.patch(sessionCheck,objectIdCheck, order.cancel)
.put(sessionCheck,objectIdCheck, order.return)
module.exports=router;