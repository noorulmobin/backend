import { Router } from "express";
import { loginUser, registerUser, logoutUser ,refreshAccessToken} from "../controllers/user.controller.js";
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

export default router;
