const couponModel=require('../../model/admin/coupons')
const categoryModel=require('../../model/admin/category');
const moment=require('moment')

exports.viewPage=async(req,res)=>{
    try {
       const coupons=await couponModel.find();
       const categories=await categoryModel.find() 

    res.render("admin/coupon",{
        session:req.session.admin,
        documentTitle:"Coupon Management",
        coupons,
        categories,
        moment
    })
    } catch (error) {
        console.log("error rendering coupon page "+error)
    }
}

exports.addNew=async(req,res)=>{
    try {
        await couponModel.create(req.body);
        res.redirect("/admin/coupon");

    } catch (error) {
        res.redirect("/admin/coupon")
      console.log("Error adding new coupon: " + error);
    }
}

exports.changeActivity=async(req,res)=>{
    try {
        couponID=req.query.id;
        console.log(couponID);
        const currentCoupon=await couponModel.findById(couponID)
        let currentActivity=currentCoupon.active;
        console.log(currentActivity);
        currentActivity = !currentActivity;
        await couponModel.findByIdAndUpdate(couponID,{
            $set:{active:currentActivity}
        });
        res.redirect("/admin/coupon")

    } catch (error) {
        res.redirect("/admin/coupon")
        console.log("error on chnaging coupon activity :"+error)
    }
}