const mongoose =require("mongoose");
const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter product Name"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"Please enter product Description"]
    },
    price:{
        type:Number,
        required:[true,"Please enter product Price"],
        maxLength:[6,"Price cannot exceed 8 character"]
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[ //we're making it array of images lot of img can be uploaded
       {
        public_id:{
            type:String,
            required:true
            },
        url:{
            type:String,
            required:true
            }
        }
    ],
    category:{
        type:String,
        required:[true,"Please enter product product Category"]
    },
    stock:{
        type:Number,
        required:[true,"Please enter product product Category"],
        maxLength:[4,"Stock cannot exceed 4 character"],
        default:1
    },
    numOfReviews: {
        type: Number,
        default: 0,
      },
      reviews: [
        {
          user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          rating: {
            type: Number,
            required: true,
          },
          comment: {
            type: String,
            required: true,
          },
        },
      ],
    
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
    createdAt:{
        type:Date,
        default:Date.now
    }

})

module.exports = mongoose.model("Product",productSchema);