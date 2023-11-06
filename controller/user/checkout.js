const session = require("express-session");
const { default: mongoose } = require("mongoose");
const cartModel=require("../../model/user/cart")
const userModel=require("../../model/user/userSchema")
const orderModel=require("../../model/user/order");
const couponModel=require('../../model/admin/coupons')
const productModel=require('../../model/admin/product')

const paypal=require("paypal-rest-sdk")
const Razorpay=require("razorpay")
const nodemailer=require("nodemailer")



exports.viewPage=async(req,res)=>{
    try {
        const currentUser=await userModel.findById(req.session.userID)
        const userCart=await cartModel.findOne({customer:req.session.userID}).populate("products.name");
        let products=userCart.products
        if(userCart.totalQuantity!=0){
            let allAddresses=await userModel.findById(req.session.userID)
            allAddresses=allAddresses.addresses;
            let defaultAddress=await userModel.aggregate([
                {$match:{_id:new mongoose.Types.ObjectId(req.session.userID)}},
                {$unwind:"$addresses"},
                {$match:{'addresses.primary':true}}              
            ]);
            let coupons=await couponModel.find({active:true})
            if(defaultAddress!=""){
                defaultAddress=defaultAddress[0].addresses;
            }else{
                defaultAddress=0
            }
            console.log(defaultAddress);
            res.render("user/partials/checkout",{
                session:req.session.userID,
                defaultAddress,
                products,
                userCart,
                allAddresses,
                coupons,
                documentTitle:"checkout",
                currentUser
                
            })
        }else{
            res.redirect("/cart")
        }
    } catch (error) {
        res.redirect("/cart");
         console.log('error on rendering checkoutpage :'+error)
    }
}

exports.defaultAddress=async(req,res)=>{
    try {
        const userID=req.session.userID;
        const DefaultAddress=req.body.DefaultAddress;
        await userModel.updateMany(
            {_id:userID,"addresses.primary":true},
            {$set:{'addresses.$.primary':false}}
        );
        await userModel.updateOne({
            _id:userID,"addresses._id":DefaultAddress},
            {$set:{"addresses.$.primary":true}});

            res.redirect('/cart/checkout')
    } catch (error) {
        res.redirect("/cart/checkout");
        console.log("error on changing to deafultaddress :"+error)
    }
}

// 

exports.couponCheck=async(req,res)=>{
    try{
      const couponCode=req.body.couponCode;
      const userCart= await cartModel.findOne({
        customer:req.session.userID
      });
      const cartPrice= userCart.totalPrice;
      if(couponCode==''){
  
        res.json({
          data: {
            couponCheck: null,
            discountPrice: 0,
            discountPercentage: 0,
            finalPrice: userCart.totalPrice,
          },
        });
      }else{
         const coupon=await couponModel.findOne({code:couponCode});
         let discountPercentage = 0;
        let discountPrice = 0;
        let finalPrice = cartPrice;
        if(coupon){
          const alreadyUsedCoupon= await userModel.findOne({
            _id: req.session.userID,
            couponsUsed: coupon._id,
          });
        if(coupon.qty !== 0){
          if(!alreadyUsedCoupon){
            if (coupon.active == true) {
              const currentTime=new Date().toJSON();
              console.log(currentTime);
              if(currentTime > coupon.startingDate.toJSON()){
                if(currentTime < coupon.expiryDate.toJSON()){
                  discountPercentage = coupon.discount;
                  discountPrice = (discountPercentage / 100) * cartPrice;
                  discountPrice = Math.floor(discountPrice)
                  finalPrice = cartPrice - discountPrice;
  console.log(finalPrice);

                  couponCheck =
                    '<b>Coupon Applied <i class="fa fa-check text-success" aria-hidden="true"></i></b></br>' +
                    coupon.name;
  
                }else{
                  couponCheck= "<b style='font-size:0.75rem; color: red'>Coupon expired<i class='fa fa-stopwatch'></i></b>";
                }
  
              }else{
                couponCheck = `<b style='font-size:0.75rem; color: green'>Coupon starts on </b><br/><p style="font-size:0.75rem;">${coupon.startingDate}</p>`;
              }
  
            }else{
              couponCheck = "<b style='font-size:0.75rem;color: red'>Invalid Coupon !</b>";
            }
  
          }else{
            couponCheck = "<b style='font-size:0.75rem;color: red'>Coupon already used !</b>";
          } }else{
            couponCheck = "<b style='font-size:0.75rem;color: red'>Coupon Finished !</b>"
          }
  
        }else{
          couponCheck = "<b style='font-size:0.75rem;color: red'>Coupon not found</b>";
        }
        res.json({
          data: {
            couponCheck,
            discountPrice,
            discountPercentage,
            finalPrice,
          },
        });
      }
  
      }catch(error){
        
        console.log("error on coupon check :"+error)
    }
  
    }

    exports.checkout=async(req,res)=>{
        try {
            // shipping address
            console.log(req.body);
            let shippingAddress=await userModel.aggregate([
                {$match:{_id:new mongoose.Types.ObjectId(req.session.userID)}
            },{
                $unwind:"$addresses"
            },{
                $match:{"addresses._id":new mongoose.Types.ObjectId(req.body.addressID)}
            }
            ]);
            shippingAddress=shippingAddress[0].addresses;
            // coupon used
            couponUsed=await couponModel.findOne({
                code:req.body.couponCode,
                active:true
            })
            let offer=await couponModel.findOne({
                code:req.body.offer,
                active:true,
            })
            if(offer){
                couponUsed=offer
            }
            if(couponUsed){
                const currentTime=new Date().toJSON();
                if(currentTime>couponUsed.startingDate.toJSON()){
                    if(currentTime<couponUsed.expiryDate.toJSON()){
                        couponUsed=couponUsed._id;
                    }else{
                        req.body.couponDiscount = 0;
                      }
                }else{
                    req.body.couponDiscount=0;
                }
            }else{
                req.body.couponDiscount=0;
            }
            if(!req.body.couponDiscount){
                req.body.couponDiscount=0
                couponUsed=null;
            };
            req.session.couponUsed=couponUsed;

            // cart summary
            const orderSummary=await cartModel.aggregate([
                {
                    $match:{customer:new mongoose.Types.ObjectId(req.session.userID)}
                  },{
                    $unwind:"$products"
                  },{
                    $project:{
                      _id:0,
                      product:"$products.name",
                      quantity:"$products.quantity",
                      totalPrice:"$products.price",
                    }
                  }
            ]);
            const userCart=await cartModel.findOne({customer:req.session.userID});

            // creating odrer details
            let orderDetails={
                customer:req.session.userID,
                shippingAddress:{
                    building: shippingAddress.building,
                    address: shippingAddress.address,
                    pincode: shippingAddress.pincode,
                    country: shippingAddress.country,
                    contactNumber: shippingAddress.contactNumber,
                },
                couponUsed:couponUsed,
                summary:orderSummary,
                totalQuantity: userCart.totalQuantity,
                price: userCart.totalPrice,
                finalPrice: req.body.finalPrice,
                discountPrice: req.body.couponDiscount,
                modeOfPayment:req.body.paymentMethod,
            };
            req.session.orderDetails=orderDetails;
            const transactionID = Math.floor(
              Math.random() * (1000000000000 - 10000000000) + 10000000000
            );
            req.session.transactionID=transactionID;

            if(req.body.paymentMethod==='COD'){
                res.redirect("/cart/checkout/"+transactionID);

            }
            // else if(req.body.paymentMethod==="paypal"){
            //     let billAmount=orderModel.finalPrice*0.012;
            //     billAmount=billAmount.toFixed(2)
            //     console.log(billAmount);

            //     // paypal configuration
            //     paypal.configure({
            //         mode:"sandbox",//sandbox or live
            //         client_id:process.env.PAYPAL_CLIENTID,
            //         client_secret:process.env.PAYPAL_SECRET
            //     });
            //     const create_payment_json={
            //         intent:"sale",
            //         payer:{
            //             payment_method:"paypal"
            //         },
            //         redirect_urls:{
            //             return_url: `https://TickTick.live/users/cart/checkout/${transactionID}`,
            //              cancel_url: "https://TickTick.live/users/cart/checkout"
            //         },
            //         transactions: [{
            //             item_list: {
            //                 items: [{
            //                   name: `Order Number-${transactionID}`,
            //                   sku: `Order Number-${transactionID}`,
            //                     price: billAmount,
            //                     currency: "USD",
            //                     quantity: 1
            //                 }]
            //             },
            //             amount: {
            //                 currency: "USD",
            //                 total: billAmount
            //             },
            //             description: "SHOE ZONE E-Commerce"
            //         }]
            //     };
            //     paypal.payment.create(
            //         create_payment_json,
            //         async function (error, payment) {
            //           if (error) {
              
            //             console.log("payment page error :"+error);
            //           } else {
            //             for (let i = 0; i < payment.links.length; i++) {
            //               if (payment.links[i].rel === "approval_url") {
            //                 res.redirect(payment.links[i].href);
            //               }
            //             }
            //           }
            //         }
            //       );
            // }
            else if(req.body.paymentMethod==="RazorPay"){
                //razor pay configuration
                const razorpay=new Razorpay({
                    key_id:process.env.RAZORPAY_KEYID,
                    key_secret:process.env.RAZORPAY_KEYSECRET
                });
                const options={
                    amount:orderDetails.finalPrice*100,
                    currency:'INR',
                }
                razorpay.orders.create(options,(err,order)=>{
                    order.transactionID=transactionID;
                    order.key=process.env.RAZORPAY_KEYID;
                    res.json(order)
                })
console.log(transactionID);
            }
        } catch (error) {
            console.log("error on checkout :"+error)
        }
    }

    exports.result=async(req,res)=>{
        try {
            if(req.session.transactionID){
                const couponUsed=req.session.couponsUsed;
                req.session.transactionID=false;
                const orderDetails=new orderModel(req.session.orderDetails)
                await orderDetails.save();
                let currentUser=await userModel.findById(req.session.userID)
                console.log(currentUser.email);
                if(couponUsed){
                    await userModel.findByIdAndUpdate(req.session.userID,{
                        $push:{
                            orders:orderDetails,
                            couponsUsed:couponUsed
                        }
                    })
                    await couponModel.findByIdAndUpdate(couponUsed,{
                        $inc:{qty:-1}
                    })
                }else{
                    await userModel.findByIdAndUpdate(req.session.userID,{
                        $push:{
                            orders:orderDetails._id,  
                        }
                    })
                }
                    console.log(req.session.orderDetails.summary)
                    req.session.orderDetails.summary.forEach(async(element)=>{
                        await productModel.findByIdAndUpdate(element.product,
                            {$inc:{stock:-element.quantity}})
                    });
                    await cartModel.findOneAndUpdate({
                        customer:req.session.userID
                    },{
                        $set:{products:[],totalQuantity:0,totalPrice:0}
                    });
                    // Transporter
                    const transporter=nodemailer.createTransport({
                        service:"Gmail",
                        auth:{
                            user:process.env.TRANSPORTER_USERNAME,
                            pass:process.env.TRANSPORTER_PASSWORD
                        }
                    });

                    // mail options
                    const mailOptions={
                        from:process.env.TRANSPORTER_USERNAME,
                        to:currentUser.email,
                         subject: "Order Confirmation | Tick Tick eCommerce",
                          html: `<h1>Order Placed</h1></br><h2 style="text-color: red, font-weight: bold">YOUR ORDER HAS BEEN PLACED SUCCESSFULLY</h2></br><p>ORDER ID: ${orderDetails._id}</p>`,
                    };
                    // send mail
                    transporter.sendMail(mailOptions,(error,info)=>{
                        if(error){
                          console.log("mesaging sending error"+error);
                        }else{
                          console.log("message send to user email ");
                        }
                      });

        const userCart=await cartModel.findOne({customer:req.session.userID}).populate("products.name");

                      const orderResult="Order Placed";
                      res.render("user/partials/orderResult",{
                        documentTitle:orderResult,
                        orderID:orderDetails._id,
                        session:req.session.userID, 
                        userCart
                      })
                
            }else{
                res.redirect("/cart/checkout");
            }
        } catch (error) {
            console.log("error on rendering success page :" +error)
        }
    }