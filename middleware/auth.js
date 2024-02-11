const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticatedUser = catchAsyncErrors(async(req,res,next)=>{
    const {token} = req.cookies;
    console.log(token);
    if(!token){
        return next(new ErrorHandler("Please Login to access this resourse",401)); //u r getting this in stripe and also some time in login page also need to check
    }
    const decodedData= jwt.verify(token,process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    next();
});

exports.authorizedRoles =(...roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){ // if the role is not admin then it'll called otherwise it'll go to next
            return next(
            new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`,403) // status 403 signifys that server get to know what u want to do it refuse
        );
        }
        next();
    };
};