import express  from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();

app.use(({
    origin: process.env.CORS_ORIGION,
    credientials:true 
}))
 app.use(express.json({limit:"16kb"}))


export {app}