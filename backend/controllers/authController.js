const catchAsyncError = require("../middlewares/catchAsyncError");
const User = require("../models/userModel");
const sendEmail = require("../utils/email");
const errorHandler = require("../utils/errorHandling");
const sendToken = require("../utils/jwt");
const crypto = require("crypto");

//Register User - /api/v1/register
exports.registerUser = catchAsyncError(async(req, res, next)=> { //catchAsyncError will handle errors...async will work as argument...
    const {name, email, password} = req.body

    let avatar;  //initially it would be undefined., because avatar is optional by user side.., so creating seperate one for avatar..

    //For deployment the url should be dynamic so using this process..
    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV == 'production') {
        BASE_URL = `${req.protocol}://${req.get('host')}`  //Will load url dynamically after deployed...
    }
    if(req.file) {
        avatar = `${BASE_URL}/upload/user/${req.file.originalname}`;  //for getting image from Url..
    }

    const user = await User.create({
        name,
        email,
        password,
        avatar   //if user sends avatar image it would store, if not it remains undefined...
    });

    sendToken(user, 201, res); //it will lead into utils/ sendToken function, which gives the success response..
    
})

//Login User - /api/v1/login
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const {email, password} =  req.body

    if(!email || !password) {
        return next(new errorHandler('Please enter email & password', 400))  //next will pass this to error handling middleware..
    }

    //finding the user database
    const user = await User.findOne({email}).select('+password');

    if(!user) {
        return next(new errorHandler('Invalid email or password', 401))
    }
    
    if(!await user.isValidPassword(password)){  //await will compare the password...
        return next(new errorHandler('Invalid email or password', 401))
    }

    sendToken(user, 201, res)  //it will lead into utils/ sendToken function, which gives the success response..
    
})

exports.logoutUser = (req, res, next) => {
    res.cookie('token', null, {
        expires : new Date(Date.now()),
        httpOnly : true
    })
    .status(200)
    .json({
        success : true,
        message : 'LoggedOut'
    })
}

//forget password... - /api/v1/password/forgot
exports.forgotPassword = catchAsyncError(async(req, res, next) => {
    const user = await User.findOne({email : req.body.email});

    if(!user){
        return next(new errorHandler('User not found with this email', 404));
    }

    const resetToken = user.getResetToken();
    await user.save({validateBeforeSave : false});

    //Create reset user url.
    //For testing backend (to get token from mailtrap.io)
    // const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`; //protocol(http).host(127.0.0.1)...which is a reser link...

    //For deployment the url should be dynamic so using this process..
    let BASE_URL = process.env.FRONTEND_URL;
    if(process.env.NODE_ENV == 'production') {
        BASE_URL = `${req.protocol}://${req.get('host')}`  //Will load url dynamically after deployed...
    }

    const resetUrl = `${BASE_URL}/password/reset/${resetToken}`; //...which is a reser link...

    const message = `Your password reset url is as follows \n\n 
    ${resetUrl} \n\n If you have not requested this email, then ignore it.`

    try {  //for sending emails to user's using mailtarp.io.. for reseting password...
        sendEmail({
            email : user.email,
            subject : "MERN_BUILD password recovery",
            message
        })
        res.status(200).json({
            success : true,
            message : `Email send to ${user.email}`
        })
    }
    catch(error) {   //if error appears while sending emails...
        user.resetPasswordToken = undefined;  
        user.resetPasswordTokenExpire = undefined;
        await user.save({validateBeforeSave : false});
        return next(new errorHandler(error.message), 500);
    }
})


//Reset Password... - /api/v1/password/reset/:token
exports.resetPasword = catchAsyncError(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');  //used to hash the token which get from mail..

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordTokenExpire : {
            $gt : Date.now()   //checks wheather the token expired or not using Date.now(which will provide miliseconds).....
        }
    })

    if(!user){
        return next(new errorHandler('Password reset token is invalid or expired'));
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new errorHandler('Password does not match.'));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;  //which removes the reset token and token expire date from user data and create new password...forgot password create token for user and reset match the user token and password then removes the resettoken from user data....(secure from hackers...)
    user.resetPasswordTokenExpire = undefined;
    await user.save({validateBeforeSave : false})  //if no need of validation so we can give false....

    sendToken(user, 201, res);
})

//Get User Profile.. - /api/v1/myprofile
exports.getUserProfile = catchAsyncError(async(req, res, next) => {
    const user = await User.findById(req.user.id);  //req.user is used to get ID from isAuthenticated and then it provides user ID.. req.body for getting json data from body...

    res.status(200).json({
        success : true,
        user
    })
});

//Change Password.. - /api/v1/password/change
exports.changePassword = catchAsyncError(async(req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');  //initially we don't get password field caz it hides in use model, so giving .select('+password') will give us password field..

    //check old password..
    if(!await user.isValidPassword(req.body.oldPassword)){  //from userModel using for to change password..
        return next(new errorHandler('old Password is incorrect', 401));
    };

    //assigning new password..
    user.password = req.body.password;
    await user.save();
    res.status(200).json({
        success : true,
        message : 'Password Changed.'
    });
})

//Update Profile... - /api/v1/update
exports.updateProfile = catchAsyncError(async(req, res, next) => {
    let newUserData = {  //first hava to get the fields that need to update...
        name : req.body.name,
        email : req.body.email
    };

    let avatar;  //initially it would be undefined., because avatar is optional by user side.., so creating seperate one for avatar..


    //For deployment the url should be dynamic so using this process..
    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV == 'production') {
        BASE_URL = `${req.protocol}://${req.get('host')}`  //Will load url dynamically after deployed...
    }

    if(req.file) {  //It only worls if user updates their avatar profile in frontend...
        avatar = `${BASE_URL}/upload/user/${req.file.originalname}`;  //for getting image from Url..
        newUserData = {...newUserData, avatar}
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new : true,
        runValidators : true  //checks schema validations..and returns errors if validator false..
    });

    res.status(200).json({
        success : true,
        user
    })
})

//Admin: Get all users... - /api/v1/admin/users
exports.getAllUsers = catchAsyncError(async(req, res, next) => {
    const users = await User.find();  //which get all the users data...

    res.status(200).json({
        success : true,
        users
    })
})

//Admin: Get Specific User... - /api/v1/admin/user/id
exports.getUser = catchAsyncError(async(req, res, next) => {
    const user = await User.findById(req.params.id);   //for to get dynamic id....

    if(!user) {
        return next(new errorHandler(`User not found with thid id: ${req.params.id}`));
    }

    res.status(200).json({
        success : true,
        user
    })
})

//Admin: Update User... - /api/v1/admin/user/id
exports.updateUser = catchAsyncError(async(req, res, next) => {
    const newUserData = {  //first hava to get the fields that need to update...
        name : req.body.name,
        email : req.body.email,
        role : req.body.role
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new : true,
        runValidators : true  //checks schema validations..and returns errors if validator false..
    });

    res.status(200).json({
        success : true,
        user
    })
})

//Admin: Delete User... - /api/v1/admin/user/id
exports.deleteUser = catchAsyncError(async(req, res, next) => {
    const user = await User.findById(req.params.id);   //for to get dynamic id....

    if(!user) {
        return next(new errorHandler(`User not found with thid id: ${req.params.id}`));
    }

    await user.deleteOne();

    res.status(200).json({
        success : true
    })

})