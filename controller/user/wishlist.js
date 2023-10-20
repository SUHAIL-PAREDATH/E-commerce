const wishlistModel=require('../../model/user/wishlist')
const cartModel=require('../../model/user/cart')
const userModel=require('../../model/user/userSchema')

exports.viewAll=async(req,res)=>{
    try {
        const userCart=await cartModel.findOne({customer:req.session.userID}).populate({path:"products.name",populate:{path:"brand"}})
        const userWishlist=await wishlistModel
            .findOne({customer:req.session.userID})
            .populate({
                path:'products',
                populate:{
                    path:'brand',
                    model:'brands'
                },
            })
            res.render('user/partials/wishlist',{
                documentTitle : 'User Wishlist ',
                session : req.session.userID,
                userWishlist,
                userCart
            })
    } catch (error) {
        console.log('Error in User Wishlist Page : ' + error);
        const currentUser=await userModel.findById(req.session.userID);
        res.render('index/404',{
            documentTitle : '404',
            url:req.originalUrl,
            session:req.session.userID,
            currentUser

        })
    }
}
exports.addOrRemove=async(req,res)=>{
    try {
        const userWishlist=await wishlistModel.findOne({customer:req.session.userID});
        if(userWishlist){
            const productExist=await wishlistModel.findOne(
                {_id:userWishlist._id,products:req.body.id});

            if(!productExist){
                req.session.wishlistCount=req.session.wishlistCount;
                await wishlistModel.findByIdAndUpdate(userWishlist._id,{
                    $push:{products:[req.body.id]}
                });
                res.json({
                    data:{
                        message:1
                    }
                });
            }else{
                req.session.wishlistCount=req.session.wishlistCount -1;
                await wishlistModel.findByIdAndUpdate(userWishlist._id,{
                    $pull:{
                        products:req.body.id
                    }
                });
                res.json({
                    data:{
                        message:0
                    }
                });
            }
        }else{
            req.session.currentUrl=req.body.url;
            res.json({
                data:{
                    message:null
                }
            });
        }
    } catch (error) {
        console.log('Error in Add wishlist : ' + error);
        const currentUser = await userModel.findById(req.session.userID);
        res.render('index/404', {
            documentTitle : '404 | Page Not Found',
            url: req.originalUrl,
            session: req.session.userId,
            currentUser,
      });
    }
}

exports.remove=async(req,res)=>{
    try {
        const userWishlist=await wishlistModel.findOne({
            customer:req.session.userID
        });
        await wishlistModel.updateOne({
            _id:userWishlist._id,
        },{
            $pull:{
                products:req.body.productID
            }
        });
        res.json({
            data:{
                deleted:1
            }
        })
    } catch (error) {
        console.log('Error in Remove From wishlist : ' + error);
        const currentUser = await userModel.findById(req.session.userID);
        res.render("index/404",{
            documentTitle :'404|page Not Found',
            url:req.originalUrl,
            session:req.session.userID,
            currentUser,
        })
    }
}