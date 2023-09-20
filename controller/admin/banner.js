const bannerModel=require('../../model/admin/banner')

const sharp=require('sharp')

// view all banners

exports.bannerPage=async(req,res)=>{
    try {
        const allBanners=await bannerModel.find({}).sort({_id:-1})

        res.render('admin/banner',{
            session:req.session.admin,
            documetTitle:'Banner Managment',
            allBanners:allBanners,
            admin:req.admin
        });
    } catch (error) {
        console.log('Error in GET Banner ' + error);
    }
}

// adding new banner

exports.addBanner=async(req,res)=>{
    const allBanners=await bannerModel.find({}).sort({_id:-1});
    try {
        if(req.file){
            // image processing using sharp
            let bannerImage=`${req.body.title}_${Date.now()}.png`
            sharp(req.file.buffer)
                .toFormat('png')
                .png({quality:80})
                .toFile(`public/img/banners/${bannerImage}`);
            req.body.Image=bannerImage;
        }
        req.body.updatedBy=req.session.admin

        // saving to Db collection
        const newBanner=new bannerModel(req.body);
        await newBanner.save();
        res.redirect('/admin/banner')
        
    } 
    catch (error) {
        console.log('Error in Add new Banner '+ error);
            
            res.render('admin/banner',{
                  session : req.session.admin,
                  errorMessage: 'Unable to add new Banner',
                  documentTitle : 'Banner Management | LAP4YOU',
                  allBanners : allBanners,
                  admin : req.admin,
            });
    }
}

// making banner inactive

exports.changeActivity=async(req,res)=>{
    try {
        // change true to false and vice versa
        let newActivity=req.body.currentActivity
        newActivity=JSON.parse(newActivity);
        newActivity=!newActivity
        await bannerModel.findByIdAndUpdate(req.body.bannerID,{
            $set:{
                active:newActivity,
                updatedBy:req.session.admin
            }
        });
        // reload will occur in ajax
        res.json({
            data:{
                activity:1
            }
        });
    } catch (error) {
        console.log('Error in Changing Activity of Banner'+ error);
    }
}

// delete banner

exports.deleteBanner=async(req,res)=>{
    try {
        const bannerID=req.body.bannerID
        await bannerModel.findByIdAndDelete(bannerID);
        res.json({
            data:{deleted:1},
        })
    } catch (error) {
        console.log('Error in Deleting Banner '+ error);
    }
}
