// //require ('dotenv').config({path:''./env'})

import dotenv from "dotenv"
import connectDB from "./db/index.js";
import express from "express";

const app = express();

dotenv.config({path:'./env'});

// Establishing connection to MongoDB
connectDB()
  .then(() => {
    // Starting the server
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed", err);
  });
