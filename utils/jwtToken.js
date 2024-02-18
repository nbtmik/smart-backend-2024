//creating token and saving in cookie
const sendToken = (user,statusCode,res)=>{
    const token = user.getJWTTOKEN();
    //options for cookie
    const options = {
        expires:new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000 // calucate in milisec
        ),
        secure: true,
        httpOnly:true,
        sameSite: 'None',
    };
    res.status(statusCode).cookie("token",token,options).json({
        success:true,
        user,
        //token,
    });
};

module.exports = sendToken;
