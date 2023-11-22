const brandModel=require('../../model/admin/brands')

// rendering the brands list page
exports.view=async(req,res)=>{
    try {
        const brandDetails= await brandModel.find({isDeleted:false})
        res.render("admin/brand",{
            session: req.session.admin,
                  documentTitle : 'Category Management | ',
                  details : brandDetails,
                  admin : req.admin,
        })
        
    } catch (error) {
        res.render('admin/index',{
            documentTitle : 'Dash Board | ',
            session : req.session.admin,
            errorMessage : error,
            admin : req.admin,
      });
    }

}

//add new brand
exports.addBrand=async(req,res)=>{
    try {
        let inputBrandName=req.body.brand;
        inputBrandName=inputBrandName.toUpperCase();
        const brandDetails=await brandModel.find({});

        //duplication check
        const duplicateCheck=await brandModel.findOne({name:inputBrandName})
        if(duplicateCheck){
            if(duplicateCheck.isDeleted==true){
                await brandModel.updateOne(
                    {_id:duplicateCheck._id},
                    {isDeleted:false}
                );
                res.render('admin/brands',{
                    documentTitle: 'Brand Management |',
                    details : brandDetails,
                    session : req.session.admin,
                    admin : req.admin,
                })
            }else{
                res.render('admin/brands',{
                    session : req.session.admin,
                    details : brandDetails,
                    errorMessage : `Brand ${inputBrandName} already exists`,
                    admin : req.admin,
                    documentTitle : 'Brand Management ',
                });
            }
        }else{
            const newBrand=new brandModel({
                name:inputBrandName,
                // updatedBy:req.session.admin.name
            });
            await newBrand.save()
            res.redirect('/admin/brands')
        }
    } catch (error) {
        console.log('Error in adding new Brand ' + error);
    }
}

exports.editBrandPage=async(req,res)=>{
    const barndId=req.query.id;
    try {
        const currentBrand=await brandModel.findById(barndId)
        req.session.currentBrand=currentBrand;
        res.render("admin/partials/editBrand",{
            session:req.session.admin,
            documentTitle:"Brand Managment",
            brand:currentBrand,
            admin:req.admin
        })
    } catch (error) {
        console.log('Error in GET Brand Page ' + error);
    }
}

exports.editBrand=async(req,res)=>{
    try {
        const currentBrand=req.session.currentBrand;
        let updateName=req.body.name;
        updateName=updateName.toUpperCase()
        // dublicate check
        const duplicateCheck=await brandModel.findOne({name:updateName})

        if(duplicateCheck==null){
            await brandModel.updateOne(
                {_id:currentBrand._id},
                {
                    name:updateName,
                    updatedBy:req.session.admin
                }
            );
        }else{
            res.render("admin/partials/editBrand",{
                session : req.session.admin,
                documentTitle:'Edit Brand ',
                brand : currentBrand,
                errorMessage : `Brand ${updateName} alredy exists..`,
                admin : req.admin,
            })
        }
    } catch (error) {
        console.log('Error in Post Brand ' + error);
    }
}

exports.deleteBrand=async(req,res)=>{
    try {
        const brandId=req.query.id;
        await brandModel.deleteOne(
            {_id:brandId},
            {
                isDeleted:true,
                updatedBy:req.session.admin
            }
            
        );
        res.redirect('/admin/brands')
    } catch (error) {
        console.log("Error is deleting Brands"+error);
    }
}