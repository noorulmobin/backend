import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from './routes/user.routes.js'; // Importing the userRouter correctly

const app = express();

app.use(cors({ // Passing options correctly to cors middleware
  // Corrected spelling of 'origin'
    credentials: true // Corrected spelling of 'credentials'
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("Public"));
app.use(cookieParser());

// Routes
app.use("/api/v1/users", userRouter);
app.get("/",(req,res)=>{
    res.json({success});
})

export { app };
