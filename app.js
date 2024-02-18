const express = require("express");
const app = express();
const errormiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const dotenv= require("dotenv");

//config
//dotenv.config({path:"backend/config/config.env"});//address of config file
dotenv.config({path:"config/config.env"});//address of config file

app.use(express.json());
app.use(cookieParser());
//app.use(cors());
app.use(cors({credentials: true,origin:`${process.env.FRONTEND_URL}`})); // added by me to avoid the error of cors-use in local
// Handle preflight requests
app.options('*', cors()); // Enable preflight requests for all routes
//app.use(cors({credentials: true,origin:"https://js.stripe.com"}));
//app.use(cors({credentials: true,origin:"https://m.stripe.network"}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());

//Route imports
const product=require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");

app.use("/api/v1",product);
app.use("/api/v1",user);
app.use("/api/v1",order);
app.use("/api/v1",payment);

//middleware for errors
app.use(errormiddleware);

module.exports = app // to export app in other file for use
