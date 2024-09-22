const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandling");
const catchAsyncError = require("../middlewares/catchAsyncError");
const ApiFeatures = require("../utils/apiFeature");

//Get - /api/v1/products
exports.getProducts = catchAsyncError(async (req, res, next)=> {
    const resPerPage = 3;  //for filtering page initail page gonna be 2..

    //For backend Purpose...so commented for changing frontend using buildQuery()...
    // const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter().paginate(resPerPage);

    //Main purpose of this to change the no of count for pagination...
    const buildQuery = () => {
        return new ApiFeatures(Product.find(), req.query).search().filter()  //It wii return a query..from using apiFeature Class..
    }
    
    //Filtered count..
    const filteredProduct = await buildQuery().query.countDocuments({})  //will get query from filtering., countDocuments will provide the count of filtered products..

    //Total count..
    const totalProductCounts = await Product.countDocuments({});  //For Pagination frontend totalItemsCount..It will show the total no of products counts instead of data load per page count..

    let productsCount = totalProductCounts;

    if(filteredProduct !== totalProductCounts) {  //For frontend pagination setup for a particular product load..
        productsCount = filteredProduct;
    }
    
    const products = await buildQuery().paginate(resPerPage).query;  //After paginate will get query object..and store in products variable


    await new Promise(resolve => setTimeout(resolve, 1000));  //Just for checking the loading animation from frontend...

    res.status(200).json({success : true, count: productsCount, resPerPage, products});
})

//Post - /api/v1/product/new
exports.newProduct = catchAsyncError(async(req, res, next) => {  //for error handling 

    //For creating more than one image using admin privelage...
    let images = [];

    //For deployment the url should be dynamic so using this process..
    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV == 'production') {
        BASE_URL = `${req.protocol}://${req.get('host')}`  //Will load url dynamically after deployed...
    }

    if(req.files.length > 0) {
        req.files.forEach(file => {
            let url = `${BASE_URL}/upload/product/${file.originalname}`;
            images.push({ image : url });
        })
    }

    req.body.images = images;

    req.body.user = req.user.id;   //get from isAuthenticated to decoded (which finds user id)... it will create a user id...
    const product = await Product.create(req.body);
    res.status(201).json({
        success : true,
        product
    })
})

//Get single product - /api/v1/product/id
exports.getSingleProduct = catchAsyncError(async(req, res, next) => {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'name email');  //added populate for getting user name in reviews...

    if(!product) {
        return next(new ErrorHandler('Product not found', 400));
    }

    // await new Promise(resolve => setTimeout(resolve, 1000)); //When Api slows the loading animation shows up...
    res.status(201).json({
        success: true,
        product
    })
})

//Update product - /api/v1/product/id
exports.updateProduct = async (req, res, next)=>{
    let product = await Product.findById(req.params.id);

    //For uploading images..from admin...
    let images = [];

    //If images not cleared we keep existing images...
    if(req.body.imagesCleared === 'false') {
        images = product.images
    }

    //For deployment the url should be dynamic so using this process..
    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV == 'production') {
        BASE_URL = `${req.protocol}://${req.get('host')}`  //Will load url dynamically after deployed...
    }

    //Done process in admin route using put method and multer method...
    if(req.files.length > 0) {
        req.files.forEach(file => {
            let url = `${BASE_URL}/upload/product/${file.originalname}`;
            images.push({ image : url });
        })
    }

    req.body.images = images;


    if(!product){
        return res.status(404).json({
            success : false,
            message : 'Product not found'
        })
    }
    
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new : true,
        runValidators : true
    })
    res.status(200).json({success : true, product});
}


//Delete Product - /api/v1/product/id
exports.deleteProduct = async(req, res, next)=>{
    const product = await Product.findById(req.params.id);

    if(!product){
        return res.status(404).json({
            success : false,
            message : 'Product not found'
        })
    }
    await product.deleteOne({_id : req.params.id});

    res.status(200).json({
        success : true,
        message : "Product deleted"
    })
}

//Create Review - /api/v1/review...
exports.createReview = catchAsyncError(async(req, res, next) => {
    const {
        productId,
        rating,
        comment
    } = req.body;

    const review = {
        user : req.user.id,
        rating : rating,
        comment : comment
    }

    const product = await Product.findById(productId);  //to know that the user reviewed the product already..

    //Finding user has already reviewed...
    const isReviewed = product.reviews.find(review => {  //Check wheather the user is already commented on this product...
        return review.user.toString() == req.user.id.toString();  //initialy it could be in object so have to change in text using toString()..
    });

    if(isReviewed) {
        //Updating the review..
        product.reviews.forEach(review => {
            if(review.user.toString() == req.user.id.toString()){  //It will update the exist review with this new reviews...
                review.comment = comment,
                review.rating = rating
            }
        })
    }
    else{
        //Creating the review...
        product.reviews.push(review);  //if the user doesn't commented it will push the new comment...
        product.numOfReviews = product.reviews.length;  //It will increase the num of reviews...
    }

    //Find the Average of the product reviews....
    product.ratings = product.reviews.reduce((acc, review) => {  //reduce used to provide the total value for ratings...
        return review.rating + acc;
    }, 0) / product.reviews.length;   //dividing would give the average for ratings....
    product.ratings = isNaN(product.ratings) ? 0 : product.ratings;  //Checks wheather the user gave rating or not if not the rating would be NAN so it would assign 0 as it's value....

    await product.save({validateBeforeSave : false});

    res.status(200).json({
        success : true
    });
})

//Get Reviews - /api/v1/reviews?id={productId}....
exports.getReviews = catchAsyncError(async(req, res, next) => {
                                                            //Using populate for to show user name and email in reviews for admin...
    const product = await Product.findById(req.query.id).populate('reviews.user', 'name email');  //query works like /reviews?id={productId}..

    res.status(200).json({
        success : true,
        reviews : product.reviews
    });
})

//Delete Review - /api/v1/review?id = reviewId & productId = productId
exports.deleteReview = catchAsyncError(async(req, res, next) => {
    const product = await Product.findById(req.query.productId);   //Will get productId in url from query...

    //Filtering the reviews which does not match the deleting the review id...
    const reviews = product.reviews.filter(review => {
        return review._id.toString() !== req.query.id.toString()
    });

    //Number of reviews updating..
    const numOfReviews = reviews.length;

    //Finding the average with filtered reviews... 
    let ratings = reviews.reduce((acc, review) => {  //reduce used to provide the total value for ratings...
        return review.rating + acc;
    }, 0) / reviews.length;   //dividing would give the average for ratings....
    ratings = isNaN(ratings)?0:ratings;

    //Save the product document...
    await Product.findByIdAndUpdate(req.query.productId, {  //which changes the review field already in the database..
        reviews,
        numOfReviews,
        ratings
    })

    res.status(200).json({
        success : true
    });

})


//For Admin...!
//Get admin products - /api/v1/admin/products...
exports.getAdminProducts = catchAsyncError(async(req, res, next) => {
    const products = await Product.find();
    res.status(200).send({
        success : true,
        products
    });
})