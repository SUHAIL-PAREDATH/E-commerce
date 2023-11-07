const productModel=require('../../model/admin/product')
const userModel=require('../../model/user/userSchema')
const orderModel=require('../../model/user/order')
const moment=require('moment');
const { order } = require('paypal-rest-sdk');


exports.view=async(req,res)=>{
    try{
        const recentOrders=await orderModel
            .find()
            .sort({ _id:-1})
            .populate({path:"customer",select:"email"})
        const orderCount=recentOrders.length;
        const productCount=await productModel.count();
        const customerCount=await userModel.count();
        let totalRevenue;
        if(customerCount){
            totalRevenue=await orderModel.aggregate([{
                $match:{
                    status:{
                        $nin:["cancelled","returned"]
                    }
                }
            },{
                $group:{
                    _id:0,
                    totalRevenue:{$sum:"$finalPrice"}
                }
            }])
            totalRevenue=totalRevenue[0].totalRevenue;
        }else{
            totalRevenue=0
        }
        res.render("admin/index",{
            session:req.session.admin,
            recentOrders,
            moment,
            orderCount,
            customerCount,
            productCount,
            totalRevenue,
            documentTitle:"admin Dashboard"
        })

    }catch(error){
console.log("Error rendering dashboard: " + error);
    }
};

exports.chartDate=async(req,res)=>{
    try {
        let currentYear=new Date();
        currentYear=currentYear.getFullYear();
        let orderData=await orderModel.aggregate([{
            $match:{
                status:{
                    $nin:['cancelled','returned']
                }
            }
        },
    {
        $project:{
            _id:0,
            totalProducts:'$totalQuantity',
            billAmount:'$finalPrice',
            week:{
                $dayOfWeek:'$orderedOn'
            },
            month:{
                $month:'$orderedOn'
            },
            year:{
                $year:"$orderedOn"
            }
        }
    },{
        $group:{
            _id:{month:"$month",year:"$year"},
            totalProducts:{$sum:"$totalProducts"},
            totalOrders:{$sum:1},
            revenue:{$sum:"$billAmount"},
            avgBillPerOrder:{$avg:'$billAmount'}
        }
    },
    {
        $match:{
            "_id.year":currentYear
        }
    },
    {
        $sort:{"_id.month":1}
    }
    ])

    const delivered=await orderModel.find({delivered:true}).count()
    const returned=await orderModel.find({status:"returned"}).count();
    let notDelivered=await orderModel.aggregate([
        {$match:{delivered:false}},
        {$group:{
            _id:"$status",
            status:{$sum:1}
        }}
    ]);
    let inTransit;
    let cancelled;
    notDelivered.forEach(order=>{
        if(order._id==="In-transit"){
            inTransit=order.status
        }else if(order._id==='Cancelled'){
            cancelled=order.status
        }
    });
    res.json({
        data: { orderData, inTransit, cancelled, delivered, returned }
    })


    } catch (error) {
        console.log("error on getting chart data : " + error)
    }
}