const { createCollection } = require('../../model/admin/details');
const productModel = require('../../model/admin/product')
const cartModel=require('../../model/user/cart')
const { default: mongoose } = require("mongoose");


exports.viewCart=async(req,res)=>{
    try {
        const userCart=await cartModel.findOne({customer:req.session.userID}).populate({path:"products.name",populate:{path:"brand"}})
        res.render("user/partials/cart",{
            userCart,
            documentTitle:"Your Cart",
            session:req.session.userID
        })
    } catch (error) {
        console.log("error rendering cart page:" + error)
    }
}

exports.addToCart=async(req,res)=>{
    try {
        const id=req.body.id
        const product=await productModel.findOne({_id:req.body.id});
        const userCart=await cartModel.findOne({customer:req.session.userID});
        const prodExist=await cartModel.findOne({
            _id:userCart._id,
            products:{$elemMatch:{name:new mongoose.Types.ObjectId(req.body.id)}}
        });
console.log(userCart.products.id.quantity);
        if(product.stock===0){
            res.json({
                success:"outofstock",
                message:0
            });
        }
        else if(prodExist){

            await cartModel.updateOne({
                _id:userCart._id,
                products:{$elemMatch:{name:req.body.id}}
            },{
                $inc:{
                    "products.$.quantity": 1,
                    totalPrice: product.price,
                    totalQuantity: 1,
                    "products.$.price": product.price,
                }
            });
            res.json({
                success: "countAdded",
                message: 1,
              });
        }
        else{
            await cartModel.findByIdAndUpdate(userCart._id,
                {
                    $push: { products: { name: req.body.id, price: product.price } },
                    $inc: { totalQuantity: 1, totalPrice: product.price }
                 })
                 res.json({
                    success: "addedToCart",
                    message: 1
                  });
        }
        
    } catch (error) {
        console.log("error on addin to cart:" + error)
    }
}

exports.removeProduct=async (req,res)=>{
    try{
        const productId=req.query.id
        const userID=req.session.userID;
        let carProduct=await cartModel.aggregate([{
            $match:{
                customer:new mongoose.Types.ObjectId(req.session.userID)
            }
        },{
            $unwind:"$products",
        },{
            $match:{
                "products.name":new mongoose.Types.ObjectId(req.query.id)
            }
        }]);
        const cartID=carProduct[0]._id;
        carProduct=carProduct[0].products;
        await cartModel.findByIdAndUpdate(cartID,{
            $pull:{
                products:{
                    name:req.query.id
                },
            },
            $inc:{
                totalPrice:-carProduct.price,
                totalQuantity:-carProduct.quantity,
            },
        });
        res.json({
            success:"removed"
        });

    }catch(error){
        res.redirect('/');
        console.log("error on remoing the product:" + error)
    }
}

exports.countChange=async (req,res)=>{
    try {
        const productID=req.body.id;
        const count=Number(req.body.count);
        const product=await productModel.findById(productID);
        await cartModel.findOneAndUpdate({
            customer:req.session.userID,
            products:{$elemMatch:{name:new mongoose.Types.ObjectId(req.body.id)}}
        },{
            $inc:{
                "products.$.quantity":count,
                totalPrice:count*product.price,
                "products.$.price":count*product.price,
                totalQuantity:count
            }
        })
        const userCart=await cartModel.findOne({customer:req.session.userID});
        const allProducts=userCart.products;

        const currentProduct=allProducts.find((product)=>{
            return product.name.valueOf()==req.body.id
        });
        if(currentProduct.quantity===0){
            await cartModel.updateOne({customer:req.session.userID},
                {
                    $pull:{products:{
                        name:productID,
                    },}
                })
        }
        res.json({
            data:{
                currentProduct,
                userCart
            }
        })
    } catch (error) {
        console.log("======================================================error on chamging count :" + error)
    }
}