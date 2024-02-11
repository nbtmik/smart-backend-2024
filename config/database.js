const mongoose = require("mongoose");


const connectDatabase=()=>{
    mongoose.connect(process.env.DB_URI,{useNewUrlParser:true}).then((data)=>{ //i can take any name instead of data also
        console.log(`Mongodb connected with server: ${data.connection.host}`);// we need to use ` instead of "" or '', we'll get the host in which it's getting connect
    });
    // .catch((err)=>{ // we don't need to use catch here bc we have already use unhandledRejection in server.js
    //     console.log(err)
    // })
}

module.exports=connectDatabase