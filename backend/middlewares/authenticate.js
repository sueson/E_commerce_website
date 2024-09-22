const catchAsyncError = require("./catchAsyncError");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandling");
const jwt = require('jsonwebtoken');

exports.isAuthenticatedUser = catchAsyncError(async(req, res, next) => {
    const { token } = req.cookies;

    if(!token){
        return next(new ErrorHandler('Login first to handle this resource', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id)
    next(); //allows to access getProducts() if the user logged in with token...
})

exports.authorizedRoles = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role: ${req.user.role} is not allowed`, 400));
        }
        next();  //if the user is admin it allows to access newProducts() from product.js 
    }
}