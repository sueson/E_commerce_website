const express = require("express");
const multer = require("multer");   ///for handling image data from frontend..
const path = require("path");

const upload = multer({storage : multer.diskStorage({  //Have to provide a space for uploading a image from frontend...
    destination : function(req, file, cb){   //file used for receiving file data from frontend, cb is a callback..
        //Create a path for receiving image from frontend to store (upload/user)...
        cb(null,path.join( __dirname, '..', 'upload/user' ) )   //initial it culd handle error, if we don't have error set that as null
                    //__dirname for to tell that in our starting path(which is currently in routes),  //giving .. to go out and find upload / user folder, because it is currently in auth.js..
        },
        filename : function(req, file, cb) {
            cb(null, file.originalname)   //initial it handles error, we don't have error on this so giving null, file.orginalname is the name of our image file, which was upload from frontend...
        }
}) })

const { 
    registerUser,
    loginUser, 
    logoutUser, 
    forgotPassword, 
    resetPasword, 
    getUserProfile,
    changePassword,
    updateProfile,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser} = require("../controllers/authController");
const {isAuthenticatedUser, authorizedRoles} = require("../middlewares/authenticate")
const router = express.Router();

router.route('/register').post(upload.single('avatar'), registerUser);  //upload is a multer function, created for multi-factor (image uploading / form-files)...
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').post(resetPasword);  //:token is used in resetPassword function as params value..
router.route('/myprofile').get(isAuthenticatedUser, getUserProfile);  //verifies the user is authenticated and then allows into getUserProfile...
router.route('/password/change').put(isAuthenticatedUser, changePassword);  //verifies and send id to change password function..
router.route('/update').put(isAuthenticatedUser, upload.single('avatar'), updateProfile);  //For updating user avatar from frontend..
                                                    //Using single for uploading single image if more than one use array...

//Admin routes
router.route('/admin/users').get(isAuthenticatedUser, authorizedRoles('admin'), getAllUsers);
router.route('/admin/user/:id').get(isAuthenticatedUser, authorizedRoles('admin'), getUser)
                                .put(isAuthenticatedUser, authorizedRoles('admin'), updateUser)
                                .delete(isAuthenticatedUser, authorizedRoles('admin'), deleteUser);


module.exports = router;