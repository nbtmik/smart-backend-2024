//try and catch for async , we've sue this so that due any error server can get close but by using this server will not close
module.exports = (theFunc) => (req,res,next)=>{
    Promise.resolve(theFunc(req,res,next)).catch(next); //try and catch and thefunc take function as input
};