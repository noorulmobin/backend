import asynchandler from '../utils/asynchandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/User.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js'; // Fixed import statement
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser = asynchandler(async (req, res) => {
    const { username, email, password, fullname ,avatar,coverimage} = req.body;

    if ([username, email, password, fullname].some(field => field?.trim() === "")) {
        throw new ApiError(400, 'All fields are required');
    }

    const existedUser = await User.findOne({ $or: [{ username }, { email }] }); // Fixed missing await

    if (existedUser) {
        throw new ApiError(409, "Username and email already exist");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    console.log(avatarLocalPath);
    const coverimageLocalPath = req.files?.coverimage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }

    const avatars = await uploadOnCloudinary(avatarLocalPath);
    const coverimages = await uploadOnCloudinary(coverimageLocalPath);

    if (!avatars) {
        throw new ApiError(400, "Failed to upload avatar to Cloudinary");
    }

    const newUser = await User.create({
        fullname,
        avatar: avatars.url,
        coverimage: coverimages?.url || "",
        email,
        password,
        username: username.toLowerCase()
    });

    const createdUser = await User.findById(newUser._id).select("-password -refreshToken"); // Fixed variable name and added ._id

    if (!createdUser) {
        throw new ApiError(500, "User not found");
    }

    res.status(201).json(createdUser); // Respond with created user
});

export { registerUser };
