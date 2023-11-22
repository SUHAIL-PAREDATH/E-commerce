const categoryModel = require("../../model/admin/category");

exports.view=async(req,res)=>{
    try {
        const categoryDetails=await categoryModel.find({isDeleted:false});
        res.render("admin/categorys",{
            session:req.body.admin,
            documentTitle : 'Category Management ',
            details : categoryDetails,
        })
    } catch (error) {
      console.log("Error rendering all catergories:"+error);
    }
    
}
exports.addCategory=async(req,res)=>{
    try {
        let inputCategory=req.body.category;
        console.log(inputCategory)
        inputCategory=inputCategory.toLowerCase();
        const categories=await categoryModel.find({});
        const categoryCheck=await categoryModel.findOne({name:inputCategory})

        if(categoryCheck){
            res.render("admin/category",{
                documentTitle:"Category Management",
                details: categories,
                errorMessage: "Category Already existing."
            })

        }else{
            const newCategory=new categoryModel({
                name:inputCategory
            });
            await newCategory.save()
            res.redirect("/admin/category")
        }
    } catch (error) {
        console.log("Error adding new category: " + error);
    }
}

exports.editCategoryPage=async(req,res)=>{
    const categoryId=req.query.id;
    try {
        const currentCategory=await categoryModel.findById(categoryId)
        req.session.currentCategory=currentCategory;

            res.render('admin/partials/editCategory',{
                session : req.session.admin,
                documentTitle : 'Category Management ',
                category : currentCategory,
                admin : req.admin,
          })
    } catch (error) {
        console.log('Error in GET Category Page ' + error);
    }
}
exports.editCategory=async(req,res)=>{
    try {
        const currentCategory=req.session.currentCategory;
        let updateName=req.body.name;
        updateName=updateName.toLowerCase();
        //duplicate check
        const duplicateCheck=await categoryModel.findOne({name:updateName});

        if(duplicateCheck==null){
            await categoryModel.updateOne(
                {_id:currentCategory._id},
                {
                    name:updateName,
                    updatedBy:req.session.admin.name
                });
                res.redirect('/admin/category')
        }else{
            res.render('admin/partials/editCategory',{
                session : req.session.admin,
                documentTitle:'Edit Category ',
                category : currentCategory,
                errorMessage : `Category ${updateName} alredy exists..`,
                admin : req.admin,
            })
        }

    } catch (error) {
        console.log('Error in Post Category ' + error);
    }

}

exports.deleteCategory=async(req,res)=>{
    try {
        const categoryId=req.query.id;
        await categoryModel.updateOne(
            {_id:categoryId},
            {
                isDeleted:true,
                updatedBy:req.session.admin.name
            });
            res.redirect('/admin/category')
    } catch (error) {
        console.log("Error is deleting category"+error);
    }
    
}