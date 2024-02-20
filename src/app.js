import express  from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();

app.use(({
    origin: process.env.CORS_ORIGION,
    credientials:true 
}))
 app.use(express.json({limit:"16kb"}))
    app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("Public"))
app.use(cookieParser())
export {app}