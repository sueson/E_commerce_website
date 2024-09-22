const express = require("express");
const { getProducts, 
    newProduct, 
    getSingleProduct, 
    updateProduct, 
    deleteProduct, 
    createReview, 
    getReviews, 
    deleteReview, 
    getAdminProducts } = require("../controllers/productController");
const {isAuthenticatedUser, authorizedRoles} = require("../middlewares/authenticate");
const multer = require("multer");   ///for handling image data from frontend..
const path = require("path");

const upload = multer({storage : multer.diskStorage({  //Have to provide a space for uploading a image from frontend...
    destination : function(req, file, cb){   //file used for receiving file data from frontend, cb is a callback..
        //Create a path for receiving image from frontend to store (upload/product)...
        cb(null,path.join( __dirname, '..', 'upload/product' ) )   //initial it could handle error, if we don't have error set that as null
                    //__dirname for to tell that in our starting path(which is currently in routes),  //giving .. to go out and find upload / product folder, because it is currently in product.js..
        },
        filename : function(req, file, cb) {
            cb(null, file.originalname)   //initial it handles error, we don't have error on this so giving null, file.orginalname is the name of our image file, which was upload from frontend...
        }
}) })

const router = express.Router();

router.route('/products').get(getProducts)  
router.route('/product/:id')
                            .get(getSingleProduct)   //Chain function for same url
                    
router.route('/review').put(isAuthenticatedUser, createReview);


//Admin routes
router.route('/admin/product/new').post(isAuthenticatedUser, authorizedRoles('admin'),upload.array('images'), newProduct)  //have to login usin isAuthenticatedUser then it authorize....
                                                                                        //Using array for uploading more than one images followed by auth route...
router.route('/admin/products').get(isAuthenticatedUser, authorizedRoles('admin'), getAdminProducts)
router.route('/admin/product/:id').delete(isAuthenticatedUser, authorizedRoles('admin'), deleteProduct)
router.route('/admin/product/:id').put(isAuthenticatedUser, authorizedRoles('admin'),upload.array('images'), updateProduct)
router.route('/admin/reviews').get(isAuthenticatedUser, authorizedRoles('admin'), getReviews);
router.route('/admin/review').delete(isAuthenticatedUser, authorizedRoles('admin'), deleteReview);
module.exports = router;