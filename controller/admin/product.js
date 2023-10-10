const productModel=require('../../model/admin/product')
const categoryModel=require('../../model/admin/category')
const brandModel=require('../../model/admin/brands')
const sharp=require("sharp")
const { default: mongoose } = require('mongoose')
const category = require('../../model/admin/category')
const brand = require('../../model/admin/brands')



// product view page
exports.view=async(req,res)=>{
    try {
        const categoryDetails=await categoryModel.find()
        const brandDetails=await brandModel.find()
        const productDetails=await productModel.find().populate(['category','brand'])
        res.render('admin/products',{
            documentTitle:'Product Management',
            session : req.session.admin,
            admin : req.admin,
            categories : categoryDetails,
            brands : brandDetails, 
            products : productDetails,
        });
        
    } catch (error) {
        console.log('Product Page rendering Error ' + error);
    }
    
}

// add product
exports.addProduct=async(req,res)=>{
    try {
        // name format of front image
        const frontImage=`${req.body.name}_frontImage_${Date.now()}.png`
        // using sharp module to process the image and convert it to png form and save it in the correvt path and name
        sharp(req.files.frontImage[0].buffer)
            .toFormat('png')
            .toFile(`public/img/products/${frontImage}`)
        req.body.frontImage=frontImage

        // thumbnail
        const thumbnail=`${req.body.name}_thumbnail_${Date.now()}.png`;
        sharp(req.files.thumbnail[0].buffer)
        
            .toFormat('png')
            .png({quality:80})
            .toFile(`public/img/products/${thumbnail}`)
        req.body.thumbnail=thumbnail;

        // other images
        const newImages=[];
        for(let i=0;i<3;i++){
            const imageName=`${req.body.name}_image${i}_${Date.now()}.png`;
            
            sharp(req.files.images[i].buffer)
                .toFormat('png')
                .png({quality:80})
                .toFile(`public/img/products/${imageName}`);
            newImages.push(imageName);
        }
        req.body.images=newImages;
        req.body.category=new mongoose.Types.ObjectId(req.body.category);
        req.body.brand=new mongoose.Types.ObjectId(req.body.brand)
        const newProduct=new productModel(req.body)
        await newProduct.save();
        console.log("Product added successfully");
        res.redirect('/admin/products')
    } catch (error) {
        console.log('Error in adding new product ' + error);
    }
}

// edit product page

exports.editProductPage=async(req,res)=>{
    try {
        const productId=req.query.id;
        const categories=await categoryModel.find({})
        const brands=await brandModel.find({});
        const currentProduct=await productModel.findById(productId)
        res.render("admin/partials/editproduct",{
            session:req.session.admin,
            documentTitle:"edit product",
            categories:categories,
            product:currentProduct,
            brands:brands,
            admin:req.admin,
        })
        
    } catch (error) {
        console.log('Product Editing GET error :' + error);
    }
}
exports.editProduct=async(req,res)=>{
    try {
        
        // checking file is not empty
        if(Object.keys(req.files).length !==0){
            if(req.files.frontImage){
                const frontImage=`${req.body.name}_frontImage_${Date.now()}.png`
                // using sharp module for image formattig 
                .toFormat("png")
                .png({quality:80})
                .toFile(`public/img/products/${frontImage}`)
                req.body.frontImage=frontImage;
            }
            if(req.files.thumbnail){
                const thumbnail=`${req.body.name}_thumbnail_${Date.now()}.png`;
                sharp(req.files.thumbnail[0].buffer)
                .toFormat('png')
                .png({quality:80})
                .toFile(`public/img/products/${thumbnail}`);
            req.body.thumbnail = thumbnail;
            }
            if(req.files.images){
                const newImages = [];
                for(let i = 0; i < 3; i++){
                      imageName = `${req.body.name}_image${i}_${Date.now()}.png`;
                      sharp(req.files.images[i].buffer)
                             .toFormat('png')
                            .png({quality:80})
                             .toFile(`public/img/products/${imageName}`);
                      newImages.push(imageName);
                }
                req.body.images = newImages;
          }
        }
        req.body.category=new mongoose.Types.ObjectId(req.body.category);
        req.body.brand= new mongoose.Types.ObjectId(req.body.brand);
        await productModel.findByIdAndUpdate(req.query.id, req.body);
        console.log("Product edited successfully");
        res.redirect("/admin/products");
    } catch (error) {
        console.log("Product editing POST error: " + error);
    }
}

// change product listing user side 
exports.changeListing=async(req,res)=>{
    try {
        const productId=req.query.id;
        const currentProduct= await productModel.findById(productId);
        let currrentListing=currentProduct.listed
        if(currrentListing===true){
            currrentListing=false
        }else{
            currrentListing=true
        }
        currrentListing=Boolean(currrentListing);
        await productModel.findByIdAndUpdate(productId,{
            listed:currrentListing,
            updatedBy:req.session.admin
        });
        res.redirect('/admin/products')
    } catch (error) {
        console.log('Error in Product unlisting '+ error);
    }
}