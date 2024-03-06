import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/Multer.js";

const router = Router();

// Define the route for user registration
router.route("/register").post(
upload.fields([
    { 
        name:"avatar",
        maxCount:1 
    },
    {
        name:"coverimage",
        maxCount:3
    },
]),
registerUser);

export default router;
