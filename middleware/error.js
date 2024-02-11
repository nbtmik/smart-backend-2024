const ErrorHandler = require("../utils/errorhandler");

module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";


    //Wroung mongodb Id error
    if(err.name==="CastError"){
        const message = `Resource not found. Invalid:${err.path}`;
        err = new ErrorHandler(message,400);
    }

    //Mongoose duplicate key error // we need to look into it 
    // if(err.code === 11000){
    //     const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    //     err = new ErrorHandler(message,400);
    // }

        //Wrong JWT error
        if(err.name==="JsonWebTokenError"){
            const message = `Json Web Token is invalid, Try again `;
            err = new ErrorHandler(message,400);
        }

       //JWT Expire error
        if(err.name==="TokenExpiredError"){
            const message = `Json Web Token is Expired, Try again `;
            err = new ErrorHandler(message,400);
        }

    res.status(err.statusCode).json({
        success:false,
        message:err.message //or can use err.stack to get all the stack assocaited with error
    });
}

