import { Router } from "express";
import {
     loginUser,
     registerUser, 
     logoutUser ,
     refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/Multer.js";
import Jwt from "jsonwebtoken";

const router = Router();

// Define the JWT verification function
const verifyJwt = (req, res, next) => {
    // Your JWT verification logic here
    // For example, using Jwt.verify() to verify the token
    const token = req.headers.authorization; // Assuming the token is in the Authorization header
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    Jwt.verify(token, "ACCESS_TOKEN_SECRET", (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        } else {
            req.userId = decoded.userId; // Assuming your JWT payload contains userId
            next();
        }
    });
};

// Define the route for user registration
router.route("/register").post(
    upload.fields([
        { 
            name: "avatar",
            maxCount: 1 
        },
        {
            name: "coverimage",
            maxCount: 3
        },
    ]),
    registerUser
);

router.route("/login").post(loginUser);

// Secured route requiring JWT verification
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/chnage-passwords").post(verifyJwt, changeCurrentPassword);
router.route("/current-user").get(verifyJwt,getCurrentUser);
router.route("/update-account").patch(verifyJwt,updateAccountDetails);
router.route("/avatar").patch(verifyJwt,upload.single("avatar"),updateUserAvatar);
router.route("/cover-image").patch(verifyJwt,upload.single("coverimage"),updateUserCoverImage);
router.route("/c/:username").get(verifyJwt,getUserChannelProfile)
router.route("/history").get(verifyJwt,getWatchHistory)

export default router;
