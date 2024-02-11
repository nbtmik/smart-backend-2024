const app = require("./app"); // importing app from app.js
const dotenv= require("dotenv");
const cloudinary = require("cloudinary");
const connectDatabase=require("./config/database");

//Handling  Uncaught Exception
process.on("uncaughtException",(err)=>{
    console.log(`Error:${err.message}`);
    console.log(`Shutting down the server due to uncaught Exception`);
    process.exit(1);
});

//config
//dotenv.config({path:"backend/config/config.env"});//address of config file
dotenv.config({path:"config/config.env"});//address of config file

//connecting to database
connectDatabase();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const server = app.listen(process.env.PORT,function(){
    console.log(`Server is working on : ${process.env.PORT}`);
});

//Unhandled Promise Rejection
process.on("unhandledRejection",err=>{ // when any issue hapeen in server for example if mondodb port will change due to some issue
    console.log(`Error:${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);
    server.close(()=>{ //server will be closed
        process.exit(1); //should be get exited from the process
    })
})