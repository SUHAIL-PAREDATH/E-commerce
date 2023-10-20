const productModel=require('../../model/admin/product')
const categoryModel=require('../../model/admin/category')
const userModel=require('../../model/user/userSchema')
const cartModel=require('../../model/user/cart')
const wishlistModel = require('../../model/user/wishlist')


exports.view=async(req,res)=>{
    try {
        const currentUser=await userModel.findById(req.session.userID);
        const userCart=await cartModel.findOne({customer:req.session.userID})
        const productDetails=await productModel.findById(req.params.id).populate('brand').populate('category')
        const categoryId=productDetails.category._id;

        let productExistInWishlist=null
        if(currentUser){
            productExistInWishlist=await wishlistModel.findOne({
                customer:currentUser._id,
                products:{$in:[productDetails._id]}
            });
        productExistInWishlist=productExistInWishlist?productExistInWishlist.products:null;
        }
        console.log(productDetails.userCart+"=====================");
        const similarProduct=await productModel.find({}).sort({_id:1}).limit(8)
        res.render('index/product',{
            documentTitle: productDetails.name,
            session:req.session.userID,
            productDetails,
            currentUser,
            listing:similarProduct,
            userCart,
            productExistInWishlist
            
            })
    } catch (error) {
        res.redirect("/")
        console.log("======================error rendering product page:"+error)
    }
}