const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

//Create new Order
exports.newOrder = catchAsyncErrors(async(req,res,next)=>{
    const {shippingInfo,orderItems,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice} = req.body;

    const order = await Order.create({shippingInfo,orderItems,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice,paidAt:Date.now(),user:req.user._id,});
    res.status(201).json({
        success:true,
        order,
    });
});

//get Single Order
exports.getSingleOrder = catchAsyncErrors(async(req,res,next)=>{
    const order = await Order.findById(req.params.id).populate("user","name email");//populate used here to take user name email by using it's id from user database

    if(!order){
        return next(new ErrorHandler("Order not found with this Id",404));
    }

    res.status(200).json({
        success:true,
        order,
    });
});

//get logged in user Order
exports.myOrders = catchAsyncErrors(async(req,res,next)=>{
    const orders = await Order.find({user:req.user._id}); // to get all item selected by particular user

    res.status(200).json({
        success:true,
        orders,
    });
});

//get all Order -- Admin
exports.getAllOrders = catchAsyncErrors(async(req,res,next)=>{
    const orders = await Order.find();
    
    let totalAmount=0;
    orders.forEach(order=>{
        totalAmount= totalAmount + order.totalPrice; // total amount of orders for admin to view and keep eye on it, use in dashboard 
    });

    res.status(200).json({
        success:true,
        totalAmount,
        orders,
    });
});

//Update order Status -- Admin
exports.updateOrder = catchAsyncErrors(async (req,res,next)=>{
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Order not found with this Id",404));
    }

    if(order.orderStatus==="Delivered"){
        return next(new ErrorHandler ("You have already delivered this order",400));
    }

    if(req.body.status==="Shipped"){
        order.orderItems.forEach(async(o)=>{
            await updateStock(o.product,o.quantity);
        });
    }

    order.orderStatus=req.body.status;
    
    if(req.body.status==="Delivered"){
        order.deliveredAt = Date.now();
    }

    await order.save({validateBeforeSave:false});

    res.status(200).json({
        success:true,
    });
});


async function updateStock(id,quantity){
    const product = await Product.findById(id);
    product.stock = product.stock - quantity;
    await product.save({validateBeforeSave:false});
}

//Delete Order -- Admin
exports.deleteOrder = catchAsyncErrors(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Order not found with this Id",404));
    }
    
    await order.deleteOne()

    res.status(200).json({
        success:true,
    });
});