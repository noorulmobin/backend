//require ('dotenv').config({path:''./env'})

import dotenv from "dotenv"
import connectDB from "./db/index.js";
 dotenv.config({path:'./env'});

connectDB()
.then(()=>{
    app.listen(process.env.PORT ||8000, ()=>{
        console.log(`server listening on ${process.env.PORT}`);
    });
})
.catch((err)=>{
    console.log("MongoDB connection failed", err);
}) 