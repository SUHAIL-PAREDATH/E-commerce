const productModel=require('../../model/admin/product')
const categoryModel=require('../../model/admin/category')
const brandModel=require('../../model/admin/brands')
const sharp=require("sharp")
const { default: mongoose } = require('mongoose')



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
        res.render("admin/partials/editproduct")
        
    } catch (error) {
        
    }
}