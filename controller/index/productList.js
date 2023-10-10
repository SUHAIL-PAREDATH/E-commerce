
const userModel=require('../../model/user/userSchema')
const productModel=require('../../model/admin/product')
const categoryModel=require('../../model/admin/category')
const cartModel=require('../../model/user/cart')

exports.collection=async(req,res)=>{
    try {
        // let collectionId=req.query.category;
        let listing=req.session.listing;
        let listingName
        let currentUser=null;
        let userCart=null;
        
        if(req.session.userID){
            currentUser=await userModel.findOne({_id:req.session.userID});
            userCart=await cartModel.findOne({customer:req.session.userID})
        }
        // if(!req.session.listingName){
            listingName="Our Collection"
        // }
        // if(req.session.listingName){
        //     listingName=req.session.listingName
        // }

        // if(collectionId=='collection'){
        //     listing=await productModel.find({listed:true}).populate("brand").limit(12);
        //     req.session.listing=listing
        //     listingName="Our Collection"
        // }
        if(!listing){
            listing = await productModel.find({ listed: true }).populate('category').populate('brand').sort({_id:-1})
        }
         
        res.render('index/productList',{
            session:req.session.userID,
            listingName,
            listing,
            currentUser,
            userCart
            
            })
    } catch (error) {
        res.redirect('/products')
        console.log("Error rendering our collection page: " + error);
    }
}

exports.categories=async(req,res)=>{
    try {
        let category=req.query.category;
        let listing;
        let currentUser=null;
        let currentCatrgory;
        let userCart=null;

        if(req.session.userID){
            currentUser=await userModel.findOne({_id:req.session.userID})
            userCart=await cartModel.findOne({customer:req.session.userID})

        }
        if(category== "newReleases"){
            listing=await productModel.find().sort({_id:-1});
console.log(listing);
        res.render('index/productListing',{
            listing:listing,
            userCart,
            listingName:"New Releases",
            session:req.session.userID,
            currentUser
        })
        }else{
            currentCatrgory=await categoryModel.find({name:category})
            listing=await productModel.find({
                category:currentCatrgory[0]._id,
                listed:true
            }).populate('brand')
            req.session.listing=listing;

            res.render('index/productListing',{
                listing:listing,
                listingName:currentCategory.name,
                session:req.session.userID,
                currentUser,
                userCart
            })
        }

    } catch (error) {
        res.redirect('/products')
        console.log("Error categorizing in products page: " + error);
    }
}