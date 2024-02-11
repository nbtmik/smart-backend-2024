const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Your Name"],
        maxLength:[30,"Name cannot exceed 30 character"],
        minLength:[4,"Name should have more than 4 character"]
    },
    email:{
        type:String,
        required:[true,"Please Enter Your Email"],
        unique:true,
        validate:[validator.isEmail,"Please enter a valid email"]
    },
    password:{
        type:String,
        required:[true,"Please Enter Your Password"],
        minLength:[8,"Password should be greater than 8 character"],
        select:false
    },
    avatar:{
            public_id:{
                type:String,
                required:true
                },
            url:{
                type:String,
                required:true
                }
            },
    role:{
        type:String,
        default:"user",
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
    });

    userSchema.pre("save",async function(next){   //to save the password for hashing
        if(!this.isModified("password")){ // if the pasword is already presen with previously done salting then it'll avoid 2nd round of salting
            next();
        }
        this.password = await bcrypt.hash(this.password,10); // doing salting
    });

    //JWT TOKEN
    userSchema.methods.getJWTTOKEN = function(){
        return jwt.sign({id:this._id},process.env.JWT_SECRET,{
            expiresIn:process.env.JWT_EXPIRE, //after login how many days it'll get expire
        })//id of user that's amde everytime when we create anything in mongo
    };

    //Compare Password
    userSchema.methods.comparePassword = async function(enteredPassword){
        return await bcrypt.compare(enteredPassword,this.password);
    };

    //generating password  reset token
    userSchema.methods.getResetPasswordToken = function(){
        const resetToken = crypto.randomBytes(20).toString("hex");//to generate token 
        this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");//hasing and adding resetpasswordToken to userschema
        this.resetPasswordExpire = Date.now()+ 15 * 60 * 1000; // convert into milisecond
        return resetToken;
    } 

    module.exports = mongoose.model("User",userSchema);

