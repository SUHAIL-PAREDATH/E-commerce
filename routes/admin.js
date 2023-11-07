const express=require('express');
const { get } = require('mongoose');
const router=express.Router();
const signIn=require("../controller/admin/signIn")
const userControlle=require("../controller/admin/users")
const product=require('../controller/admin/product')
const category= require('../controller/admin/category')
const brands=require('../controller/admin/brands')
const banners=require('../controller/admin/banner')
const upload=require('../utilities/imageUpload')
const coupons=require('../controller/admin/coupon')
const orders=require("../controller/admin/order")
const dashboard=require("../controller/admin/dashbord")
// const signup=require("../controller/admin/signup")
const sessionCheck=require("../middleware/admin/sessionCheck")

//========================== SIGN IN ===============================

router.
route('/')
.get(signIn.getSignIn)
.post(signIn.postSignIn),

// route('/signup')
// .get(signup.view)
// .post(signup.getSignUp)

// ==========================DashBord===============================

router.
route('/index')
.get(sessionCheck,dashboard.view)
.put(sessionCheck,dashboard.chartDate)



//========================= User Controlle =========================
router.
route("/users")
.get(sessionCheck,userControlle.getUser)
.patch(sessionCheck,userControlle.changeAccess)

//========================== category ==============================

router
.route('/category')
.get(sessionCheck,category.view)
.post(sessionCheck,category.addCategory)

// admin edit page and edit category route
router
.route('/category/edit')
.get(sessionCheck,category.editCategoryPage)
.post(sessionCheck,category.editCategory)

// delete category
router
.route('/category/delete')
.get(sessionCheck,category.deleteCategory)

// =========================== Brands ==============================

router
.route("/brands")
.get(brands.view)
.post(brands.addBrand)

// edit brand name 
router
.route('/brands/edit')
.get(brands.editBrandPage)
.post(brands.editBrand)

// delete brand
router
.route('/brands/delete')
.get(brands.deleteBrand)
//========================== Product  ==============================

router
.route('/products')
.get(product.view)

// add product

router
.route('/products/add_product')
.post(upload.fields([
    {name:"frontImage",maxCount:1},
    {name:"thumbnail",maxCount:1},
    {name:"images",maxCount:3}
])
    ,product.addProduct)

// edit product
router
.route('/products/edit_product')
.get(product.editProductPage)
.post(upload.fields([
    {name:"frontImage",maxCount:1},
    {name:"thumbnail",maxCount:1},
    {name:"images",maxCount:3}
]),
    product.editProduct)

// unlist product
router
.route("/products/changeListing")
.get(product.changeListing)

//==========================Banners ==============================

router
.route('/banner')
.get(banners.bannerPage)
.post(upload.single('bannerImage'),banners.addBanner)
.patch(banners.changeActivity)
.delete(banners.deleteBanner)


//===========================Coupons==============================

router
.route('/coupon')
.get(coupons.viewPage)
.post(coupons.addNew)

router.get("/coupon/changeActivity",coupons.changeActivity)

// =========================order==================================

router
.route("/orders")
.get(orders.viewPage)
.patch(orders.deliver)
.put(orders.return)

router.patch('/orders/cancel/:id',orders.cancelOrder)

router
.route("/orders/:id")
.get(orders.detailsPage)

module.exports=router;