import asynchandler from '../utils/asynchandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/User.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js'; // Fixed import statement
import { ApiResponse } from '../utils/ApiResponse.js';
import Jwt  from 'jsonwebtoken';
import { json } from 'express';
import asyncHandler from '../utils/asynchandler.js';


const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accesstoken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accesstoken, refreshToken };

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access & refresh token");
    }
}

const registerUser = asynchandler(async (req, res) => {
    const { username, email, password, fullname, avatar, coverimage } = req.body;

    if ([username, email, password, fullname].some(field => field?.trim() === "")) {
        throw new ApiError(400, 'All fields are required');
    }

    const existedUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existedUser) {
        throw new ApiError(409, "Username and email already exist");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;

    let coverimageLocalPath;
    if (req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length > 0) {
        coverimageLocalPath = req.files.coverimage[0].path;
    }

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

    const createdUser = await User.findById(newUser._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "User not found");
    }

    res.status(201).json(createdUser); // Respond with created user
});

const loginUser = asynchandler(async (req, res) => {
    //req body -daa
    // email or username
    //find username
    // password check
    //access token nd refresh token 
    //send cookies
    //response
    const { email, username, password } = req.body;
       console.log(email, username, password)           
    if (!username && !email) {
        throw new ApiError(400, "Invalid username or email and is required");
    }

    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    console.log(isPasswordValid);
    if (!isPasswordValid) {
        throw new ApiError(401, "Password incorrect");
    }
   
    const { accesstoken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .cookie("accesstoken", accesstoken, options)
        .cookie("refreshtoken", refreshToken, options)
        .json(
            new ApiResponse(
                200, {
                user: loggedInUser,
                accesstoken,
                refreshToken
            },
                "User logged in successfully"
            )
        );
});

const logoutUser = asynchandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        { $unset: { refreshToken: "" } },
        { new: true }
    );

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .clearCookie("accesstoken", options)
        .clearCookie("refreshtoken", options)
        .json(new ApiResponse(200, {}, "User logged out"));
});

const refreshAccessToken =asynchandler(async(req, res)=>{
   const incomingRefreshToken= req.cookies.refreshToken || 
   req.body.refreshToken 
   if(!incomingRefreshToken){
    throw new ApiError(401,"unauthorized access")
   }

try {
     const decodedToken=  Jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
       )
      const user=await  User.findById(decodedToken?._id)
      if(!user) {
        throw new ApiError(401,"invalid refresh token")
       }
    
       if(incomingRefreshToken!==user?.refreshToken) { 
        throw new ApiError(401," refresh token is expired")
       }
    
       const options = {
        httpOnly: true,
        secure: true
       }
     const {accesstoken,newrefreshToken}= await  generateAccessAndRefreshToken(user._id,)
       return res
       .status(200)
       .cookie("accessToken",accesstoken,options)
       .cookie("refreshToken",newrefreshToken,options)
       .json(
        new ApiResponse(
            200,{accesstoken,refreshToken:newrefreshToken},
            "AccessToken refreshed successfully"
        
            )
       )
    
} catch (error) {
    throw new ApiError(401,error?.message || "invalid refresh token")
}
})


const changeCurrentPassword = asyncHandler(async(req, res)=>{
    const {oldPassword, newPassword,} =req.body
    // const {oldPassword, newPassword,confirmPassword} =req.body
    // if(!(newPassword===confirmPassword)) {
    //     throw new ApiError(400,"password not match")
    // }

   const user= await User.findById(req.user?._id)

    const isPasswordCorrect= await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400,"Invalid password")
    }

    user.password = newPassword 
    await  user.save({validateBeforeSave:false})

    return res
    .status(200)
    .json(new ApiResponse(200,{},"Password changed successfully"))


})


const getCurrentUser = asyncHandler(async(req, res)=>{
    return res
    .status(200)
    .json(200,req.user,"current user fetched successfully")
})


const updateAccountDetails = asyncHandler(async(req, res)=>{
    const {fullname,email}=req.body;

    if(!fullname || !email){
        throw new ApiError(400, "All fields are required")
    }
 const user= awaitUser.findByIdAndUpdate (
    req.user?._id,
    {
        $set:{
            fullname,
            email
        }
    },
    {new:true}
    ).select("-password") 

    return res
    .status(200)
    .json(new ApiResponse(200,user,"account details updated"))
});

const updateUserAvatar= asyncHandler(async(req,res) => {
    const avatarLocalPath = req.file?.path

    if(!avatarLocalPath){
        throw new ApiError(400,"avatar is missing")
    }
    const avatar =  await uploadOnCloudinary(avatarLocalPath)
    if(!avatar.url){
        throw new ApiError(400,"error while uploading avatar")
    }
   const user=  await User.findByIdAndUpdate(req.user?._id,
        {
            $set:{
                avatar:avatar.url
            }
        },
       
        {new:true}

        ).select(-password)
        return res
        .status(200)
        .json(new ApiResponse(200,avatar,"avatar updated"))
})

const updateUserCoverImage= asyncHandler(async(req,res) => {
    const coverimageLocalPath = req.file?.path

    if(!coverimageLocalPath){
        throw new ApiError(400,"coverimage is missing")
    }
    const coverimage =  await uploadOnCloudinary(coverimageLocalPath)
    if(!coverimage.url){
        throw new ApiError(400,"error while uploading coverimage")
    }
    const user= await User.findByIdAndUpdate(req.user?._id,
        {
            $set:{
                coverimage:coverimage.url
            }
        },
       
        {new:true}

        ).select(-password)
        return res
        .status(200)
        .json(new ApiResponse(200,user,"coverimage updated"))
})


const getUserChannelProfile = asyncHandler(async(req, res) => {
    const {username} = req.params

    if (!username?.trim()) {
        throw new ApiError(400, "username is missing")
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1

            }
        }
    ])
    if(!channel?.length){
        throw new ApiError(404,"channel does not exist")
    }
    return res
    .status(200).json(new ApiResponse(200,channel[0],"User channel fetched succesfully") )
});

const getWatchHistory= asyncHandler(async(req, res)=>{

const user= await User.aggregate([
    {
        $match:{
            _id:new mongoose.Types.ObjectId(req.user._id),
        }
    },
    {
        $lookup:{
            from:"Videos",
            localFields:"watchHistory",
            foreignFields:"_id",
            as:"watchHistory",

            pipeline:[
                {
                    $lookup:{
                        from:"users",
                        localField:"owner",
                        foreignField:"_id",
                        as:"owner",
                        pipeline:[
                            {
                                $project:{
                                    fullName:1,
                                    username:1,
                                    avatar:1
                                }
                            }
                        ]

                    }
                },
                {
                    $addField:{
                        owner:{
                            $first:"$owner"
                        }
                    }
                }
            ]

        }
    }
])

return res
.status(200)
.json(
    new ApiResponse(200,user[0].watchHistory,"watch history fetched successfully")
)




})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory

};
