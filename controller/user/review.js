const reviewModel=require("../../model/user/reviews")
const productModel=require('../../model/admin/product')

exports.addNew=async(req,res)=>{
    try {
        console.log(req.query);
        req.body.customer=req.session.userID
        req.body.product=req.query.productID
        console.log(req.body);
    await reviewModel.create(req.body);
    res.json({
        success:1,
    });
    } catch (error) {
        res.redirect('/');
        console.log("error on adding new review") 
    }
}

exports.helpful=async(req,res)=>{
    try {
        console.log(req.body.reviewID);
        if(req.session.userID!=undefined){
            await reviewModel.findByIdAndUpdate(req.body.reviewID,{
                $inc:{
                    helpful:1,
                },
            });
            res.json({
                success:1,
            });
        }else{
            res.json({
                success:0
            })
        }
    } catch (error) {
        res.redirect('/');
        console.log("error on helping new review"+error) 
    }
}
// exports.helpful = async (req, res) => {
//     try {
//         console.log(req.body.reviewID);
//         if (req.session.userID !== undefined) {
//             const review = await reviewModel.findById(req.body.reviewID);

//             if (!review.userIDs.includes(req.session.userID)) {
//                 await reviewModel.findByIdAndUpdate(req.body.reviewID, {
//                     $inc: {
//                         helpful: 1,
//                     },
//                     $push: {
//                         userIDs: req.session.userID,
//                     },
//                 });
//                 res.json({
//                     success: 1,
//                 });
//             } else {
//                 res.json({
//                     success: 0,
//                     message: 'You have already helped this review.'
//                 });
//             }
//         } else {
//             res.json({
//                 success: 0
//             })
//         }
//     } catch (error) {
//         res.redirect('/');
//         console.log("error on helping new review" + error)
//     }
// }