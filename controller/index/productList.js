
const userModel=require('../../model/user/userSchema')
const productModel=require('../../model/admin/product')
const categoryModel=require('../../model/admin/category')
const cartModel=require('../../model/user/cart')
const brandModel = require('../../model/admin/brands')

exports.collection=async(req,res)=>{
    try {
        let collectionId=req.query.category;
        let listing=req.session.listing;
        let listingName
        let currentUser=null;
        let userCart=null;
        const brands=await brandModel.find({ isDeleted: false }) 
        console.log(brands);
        
        if(req.session.userID){
            currentUser=await userModel.findOne({_id:req.session.userID});
            userCart=await cartModel.findOne({customer:req.session.userID})
        }
        if(!req.session.listingName){
            listingName="Our Collection"
        }else{listingName=req.session.listingName
        }
         
        if(collectionId=='collection' && !req.session.sorted && !req.session.filter && !req.session.searched){
            listing= await productModel.find({listed:true}).populate("brand").limit(12);
            req.session.listing=listing;
            listingName="Our Collection"
          }
          else if(!collectionId&& !req.session.sorted && !req.session.filter && !req.session.searched){
            listing= await productModel.find({listed:true}).populate("brand");
            req.session.listing=listing;
            listingName="Our Collection"
          }else if(req.session.searched){
            listing=req.session.searchResult;
          }
          req.session.sorted=null;
          req.session.filter=null;
          req.session.searched=null;

         
        res.render('index/productList',{
            session:req.session.userID,
            listingName,
            listing,
            currentUser,
            userCart,
            brands
            
            })
    } catch (error) {
        res.redirect('/products')
        console.log("Error rendering our collection page: " + error);
    }
}

exports.categories=async(req,res)=>{
    try {
        let category=req.query.category;
        let listing;
        let currentUser=null;
        let currentCatrgory;
        let userCart=null;
        const brands=await brandModel.find({ isDeleted: false }) 
        console.log(brands);


        if(req.session.userID){
            currentUser=await userModel.findOne({_id:req.session.userID})
            userCart=await cartModel.findOne({customer:req.session.userID})

        }
        if(category=="newReleases"){
            listing=await productModel.find().sort({_id:-1});
            req.session.categorySort=listing
        res.render('index/productList',{
            listing:listing,
            userCart,
            listingName:"New Releases",
            session:req.session.userID,
            currentUser,
            brands
        })
        }else{
            if(!req.session.filtered&&!req.session.searched){
                currentCatrgory=await categoryModel.find({name:category})
            listing=await productModel.find({
                category:currentCatrgory[0]._id,
                listed:true
            }).populate('brand')
            req.session.listing=listing;
            req.session.categorySort=listing
            }else if(req.session.filtered){
                req.session.listing=req.session.filtered;
            }else if(req.session.searched){
                req.session.listing=req.session.searchResult;
            }
            req.session.searched = false;
            req.session.sortBy = false;
            req.session.filtered = false;   

            res.render('index/productList',{
                listing:req.session.listing,
                listingName:currentCatrgory[0].name,
                session:req.session.userID,
                currentUser,
                userCart,
                brands
            })
        }

    } catch (error) {
        res.redirect('/products')
        console.log("Error categorizing in products page: " + error);
    }
}

exports.filter=async(req,res)=>{
    try {
        let currentFilter;
        let allProducts=await productModel
            .find({listed:true})
            .populate("brand category");
        let searchClear;
        let listingName=req.body.listingName;
       

        if(req.body.brandId){
            currentFilter=await productModel
            .find({listed:true,brand:req.body.brandId})
            .populate("brand category");
            console.log(currentFilter);
        if(listingName!=="Our Collection"){
            currentFilter=currentFilter.filter((product)=>{
                return product.category.name===listingName;
            });
        }

        }else{
            if(req.session.listingName=="Our Collection"){
                currentFilter=allProducts.slice(0,9);
            }else if(req.body.filterBy=='none'){
                currentFilter=req.session.listing;
            }
        }
        console.log(currentFilter);
        req.session.listing = currentFilter;
        req.session.filtered =currentFilter;
        req.session.filter = true;
        req.session.categorySort = null;
        req.session.sortBy = false;

        if(!currentFilter&&!searchClear){
            res.json({
                success:0,
            })
        }else if(searchClear){
            res.json({
                success:"clear"
            });
        }else{
            res.json({
                success:1
            });
        }


    } catch (error) {
        console.log("Error in Products Filter Page" + error);
        const currentUser = await userModel.findById(req.session.userID);
        res.render("index/404", {
          documentTitle: "404 | Page Not Found",
          url: req.originalUrl,
          session: req.session.userID,
          currentUser,
        }); 
    }
}

exports.sortBy=async(req,res)=>{
    try {
        let listing;
    
        // Check if the listing is not already in the session
        if (!req.session.listing) {
            // If not, fetch the products and populate the brand
            req.session.listing = await productModel.find({ listed: true }).populate("brand");
        }
    
        // Retrieve the listing from the session
        listing = req.session.listing;
    
        // Handle sorting based on the request
        if (req.body.sortBy === 'ascending') {
            listing = listing.sort((a, b) => a.price - b.price);
        } else if (req.body.sortBy === 'descending') {
            listing = listing.sort((a, b) => b.price - a.price);
        } else if (req.body.sorted === 'newReleases') {
            listing = listing.sort((a, b) => {
                const id1 = a._id.toString();
                const id2 = b._id.toString();
                if (id1 < id2) {
                    return 1;
                }
                if (id1 > id2) {
                    return -1;
                }
                return 0;
            });
        }
    
        // Save the sorted listing back to the session
        req.session.listing = listing;
        req.session.sorted = 1;
        req.session.categorySort = null;
        req.session.filtered = null;
        req.session.sortBy = listing;
    
        // Send a JSON response indicating successful sorting
        res.json({
            sorted: 1
        });
    
    } catch (error) {
        console.log("Error occurred in sorting: " + error);
    
        // Handle errors here, for example, send an error response
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
    
}

exports.searching=async(req,res)=>{
    try {
        let searchResult=[];
        if(req.session.filtered){
            const regex=new RegExp(req.body.searchInput,"i");
            req.session.filtered.forEach((product)=>{
                if(regex.exec(product.name)){
                    searchResult.push(product);
                }
            });
        }else if(req.session.sortBy){
            const regex=new RegExp(req.body.searchInput,"i");
            req.session.listing.forEach((product)=>{
                if(regex.exec(product.name)){
                    searchResult.push(product);
                }
            })
        }else if(req.session.categorySort){
            const regex=new RegExp(req.body.searchInput,"i");
            req.session.categorySort.forEach((element)=>{
                if(regex.exec(element.name)){
                    searchResult.push(element);
                }
            })
        }else {
            searchResult=await productModel.find({
                name:{
                    $regex:req.body.searchInput,
                    $options:"i",
                },
                listed:true
            });
        }

        req.session.listing=searchResult;
        req.session.searchResult=searchResult;
        req.session.searched=true;
        res.json({
            message:"Searched"
        })
    } catch (error) {
        
    }
}