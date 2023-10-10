const productModel=require('../../model/admin/product')
const categoryModel=require('../../model/admin/category')
const userModel=require('../../model/user/userSchema')
const cartModel=require('../../model/user/cart')


exports.view=async(req,res)=>{
    try {
        const currentUser=await userModel.findById(req.session.userID);
        const userCart=await cartModel.findOne({customer:req.session.userID})
        const productDetails=await productModel.findById(req.params.id).populate('brand').populate('category')
        console.log(productDetails.userCart+"=====================");
        const similarProduct=await productModel.find({}).sort({_id:1}).limit(8)
        res.render('index/product',{
            documentTitle: productDetails.name,
            session:req.session.userID,
            productDetails,
            currentUser,
            listing:similarProduct,
            userCart
            })
    } catch (error) {
        res.redirect("/")
        console.log("======================error rendering product page:"+error)
    }
}