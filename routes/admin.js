const express=require('express');
const { get } = require('mongoose');
const router=express.Router();
const signIn=require("../controller/admin/signIn")
const singOut=require("../controller/admin/logOut")
const userControlle=require("../controller/admin/users")
const product=require('../controller/admin/product')
const category= require('../controller/admin/category')
const brands=require('../controller/admin/brands')
const banners=require('../controller/admin/banner')
const upload=require('../utilities/imageUpload')
const coupons=require('../controller/admin/coupon')
const orders=require("../controller/admin/order")
const dashboard=require("../controller/admin/dashbord")
const salesReport=require("../controller/admin/salesReport")
// const signup=require("../controller/admin/signup")
const sessionCheck=require("../middleware/admin/sessionCheck")


//========================== SIGN IN ===============================

router.
route('/login')
.get(signIn.getSignIn)
.post(signIn.postSignIn),

router
.route('/signout')
.get(sessionCheck,singOut.logOut)

// route('/signup')
// .get(signup.view)
// .post(signup.getSignUp)

// ==========================DashBord===============================

router.
route('/')
.get(sessionCheck,dashboard.view)
.put(sessionCheck,dashboard.chartDate)

router.get("/chart/:id",dashboard.customChartData)

//sales Report
router
.route("/salesReport")
.post(sessionCheck,salesReport.download)


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
.get(sessionCheck,brands.view)
.post(sessionCheck,brands.addBrand)

// edit brand name 
router
.route('/brands/edit')
.get(sessionCheck,brands.editBrandPage)
.post(sessionCheck,brands.editBrand)

// delete brand
router
.route('/brands/delete')
.get(sessionCheck,brands.deleteBrand)
//========================== Product  ==============================

router
.route('/products')
.get(sessionCheck,product.view)

// add product

router
.route('/products/add_product')
.post(upload.fields([
    {name:"frontImage",maxCount:1},
    {name:"thumbnail",maxCount:1},
    {name:"images",maxCount:3}
])
    ,sessionCheck,product.addProduct)

// edit product
router
.route('/products/edit_product')
.get(sessionCheck, product.editProductPage)
.post(upload.fields([
    {name:"frontImage",maxCount:1},
    {name:"thumbnail",maxCount:1},
    {name:"images",maxCount:3}
]),
    sessionCheck, product.editProduct)

// unlist product
router
.route("/products/changeListing")
.get(sessionCheck, product.changeListing)

//==========================Banners ==============================

router
.route('/banner')
.get(sessionCheck, banners.bannerPage)
.post(upload.single('bannerImage'),sessionCheck, banners.addBanner)
.patch(sessionCheck, banners.changeActivity)
.delete(sessionCheck, banners.deleteBanner)


//===========================Coupons==============================

router
.route('/coupon')
.get(sessionCheck, coupons.viewPage)
.post(sessionCheck, coupons.addNew)

router.get("/coupon/changeActivity",coupons.changeActivity)

// =========================order==================================

router
.route("/orders")
.get(sessionCheck, orders.viewPage)
.patch(sessionCheck, orders.deliver)
.put(sessionCheck, orders.return)

router.patch('/orders/cancel/:id',orders.cancelOrder)

router
.route("/orders/:id")
.get(sessionCheck, orders.detailsPage)

module.exports=router;