const catchAsyncError = require('../middlewares/catchAsyncError');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);  //It works in putting the process at top caz, we saved the dotenv config in app.js...

exports.processPayment = catchAsyncError(async(req, res, next) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount : req.body.amount,
        currency : "usd",
        description: "Test Payment",
        metadata : { integration_check: "accept_payment"},
        shipping : req.body.shipping 
    })
    res.status(200).json({
        success : true,
        client_secret : paymentIntent.client_secret    //For frontend..
    })
})


exports.sendStripeApi = catchAsyncError(async(req, res, next) => {
    
    res.status(200).json({
        stripeApiKey : process.env.STRIPE_API_KEY   
    })
})