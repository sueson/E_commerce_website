const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, 'Please enter name']
    },
    email : {
        type : String,
        required : [true, 'Please enter email'],
        unique : true,
        validate : [validator.isEmail, 'Please enter valid email address']  //Validator is an npm pakage used to valid the emails..
    },
    password : {
        type : String,
        required : [true, 'Please enter your password'],
        maxLength : [6, 'Password cannot exceed 6 characters'],
        select : false  //it hides the password when user logs in...
    },
    avatar : {
        type : String
    },
    role : {
        type : String,
        default : 'user'
    },
    resetPasswordToken : String,
    resetPasswordTokenExpire : Date,
    createdAt : {
        type : Date,
        default : Date.now()
    }
})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10)  //10 is salted..
})

userSchema.methods.getJwtToken = function(){
    return jwt.sign(
        {
            id: this.id
        },
        process.env.JWT_SECRET,
        {
            expiresIn : process.env.JWT_EXPIRES_TIME
        }
    )
}

userSchema.methods.isValidPassword = async function(enteredPassword){
    return bcrypt.compare(enteredPassword, this.password);
}

userSchema.methods.getResetToken = function(){
    //Generate token...
    const token = crypto.randomBytes(20).toString('hex');  //which create a buffer data in size of 20....hex is kind of encoding(hexaDecimal)..

    //Generate Hash and set to resetPasswordToken...
    this.resetPasswordToken =  crypto.createHash('sha256').update(token).digest('hex');  //sha256 is an algorithm..

    //Set token expire time..
    this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000; //(30 * 60 * 1000) which will expire within 30 minutes..

    return token;
}

let model = mongoose.model('User', userSchema);
module.exports = model;