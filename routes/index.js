const express=require('express')
const router=express.Router();
const landingPage=require('../controller/index/landingPage')
const sessionCheck=require('../middleware/user/sessionCheck')
const productListing=require('../controller/index/productList')
const productDetail=require('../controller/index/product')
const objectIdCheck=require('../middleware/user/objectCheck')
//==================== landing page ======================
router.
route('/')
.get(landingPage.view)

// ==================product detail view==================

router
.route('/products/:id')
.get(objectIdCheck,productDetail.view)

// categories wise arragement
router
.route("/categories")
.get(productListing.categories)

//=================== product listing page================
router
.route('/products')
.get(productListing.collection)

module.exports=router