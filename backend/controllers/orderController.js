const catchAsyncError = require("../middlewares/catchAsyncError");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandling");

//Create new Order.. - /api/v1/order/new
exports.newOrder = catchAsyncError(async(req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt : Date.now(),
        user : req.user.id
    })

    res.status(200).json({
        success : true,
        order
    })
});

//Get Single Order - /api/v1/order/:id..
exports.getSingleOrder = catchAsyncError(async(req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');  //populate brings along with user name and email format(field, name email)..

    if(!order) {
        return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`, 404));
    }

    res.status(200).json({
        success : true,
        order
    });
});

//Get Loggedin User Orders - /api/v1/myorders...
exports.myOrders = catchAsyncError(async(req, res, next) => {
    const orders = await Order.find({
        user : req.user.id
    });


    res.status(200).json({
        success : true,
        orders
    });
});

//Admin: Get all orders - /api/v1/orders...
exports.orders = catchAsyncError(async(req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount += order.totalPrice   //admin can see the total amount of all orders...
    });

    res.status(200).json({
        success : true,
        totalAmount,
        orders
    });
});

//Admin: Update Order / Order Status - /api/v1/order/:id
exports.updateOrder = catchAsyncError(async(req, res, next) => {
    const order = await Order.findById(req.params.id);

    if(order.OrderStatus == 'Delivered') {  //Checking wheather it's status is delivered or processing...
        return next(new ErrorHandler(`Order has already Delivered!`, 400));
    };

    //Updating Product Stock of each order Item...
    order.orderItems.forEach(async orderItem => {
        await updateStock(orderItem.product, orderItem.quantity)   //which stores as parameter of updateStock as productId and quantity...
    });

    order.OrderStatus = req.body.OrderStatus;  //it used to update the OrderStatus in mongoDB database from 'Processing' to 'Delivered'..
    order.deliveredAt = Date.now();
    await order.save();

    res.status(200).json({
        success : true
    })
});

async function updateStock(productId, quantity){
    const product = await Product.findById(productId);
    product.stock = product.stock - quantity;
    product.save({validateBeforeSave : false});  //It will not allow to validate before saving into mongoDB database...
};

//Admin: Delete Order - /api/v1/order/:id
exports.deleteOrder = catchAsyncError(async(req, res, next) => {
    const order = await Order.findById(req.params.id);

    if(!order) {
        return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`, 404));
    };
    
    await order.deleteOne();

    res.status(200).json({
        success : true
    })
});

