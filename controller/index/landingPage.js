const userModel=require('../../model/user/userSchema')
const bannerModel=require('../../model/admin/banner')
const brandModel=require("../../model/admin/brands")
const productModel=require('../../model/admin/product')
const categoryModel=require('../../model/admin/category')
const cartModel=require("../../model/user/cart")


exports.view =async(req,res)=>{
        try {
          let currentUser;
          let  userCart;

          // // wishlist
          // let productExistInWishlist=null
          // const productDetails=await productModel.findById(req.params.id).populate('brand').populate('category')



          if(req.session.userID){
            currentUser=await userModel.findById(req.session.userID);
            userCart=await cartModel.findOne({customer:req.session.userID})

            // for wish list
            // productExistInWishlist=await wishlistModel.findOne({
            //   customer:currentUser._id,
            //   products:{$in:[productDetails._id]}
            // });
            // productExistInWishlist=productExistInWishlist?productExistInWishlist.products:null;
          }
          const banners=await bannerModel.find({active:true}).limit(3).sort({title:1});
          const allProduct=await productModel.find({listed:true}).populate('category').populate('brand').sort({_id:-1});

          let newReleases=allProduct.slice(0,4);
          let men=[];
          let women=[];
          let kids=[]

          allProduct.forEach((product)=>{
            if(product.category.name=="men"){
              men.push(product);
            }else if(product.category.name=="women"){
              women.push(product);
            }else{
              kids.push(product)
            }
          })
          men=men.slice(0,4)
          women=women.slice(0,4)
          kids=kids.slice(0,4)

          res.render("index/landingPage",{
            session:req.session.userID,
            currentUser,
            newReleases,
            men,
            women,
            banners,
            userCart,
            allProduct,
            
            })
          
        
        } catch (error) {
          console.log("error renderig using signup page" + error);
        }
        
      
}
    