import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    if(!videoId){
        throw new ApiError(400,"video is missing")

    }
    //TODO: toggle like on video
    const Like=await Like.create({video:videoId,likedBy:req.user})
    if(!Like){
        throw new ApiError(404,"couldn't find like");
    }
    res
    .status(200)
    .json(ApiResponse(200,Like,"succes"))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    if(!commentId) {
        throw new ApiError(400,"Invalid comment")
    }
    //TODO: toggle like on comment
    const Comment= await Comment.create({video:commentId,likedBy:req.user})
    if(!Comment){
        throw new ApiError(404,"Comment not found")
    }
    res
    .status(200)
    .json(ApiResponse(200,Comment,"succes"))
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    if(!tweetId){
        throw new ApiError(400,"tweet not found")
    }
  //TODO: toggle like on tweet
    const Tweet = await Tweet.create({video:tweetId,likedByBy:req.user})
    if(!Tweet){
        throw new ApiError(404, "tweet not found")
    }
    res.status(200)
    .json(new ApiResponse(200,Tweet,"success"))

  
}
)
//TODO: get all liked videos
const getLikedVideos = asyncHandler(async (req, res) => {
    const {page=1,limit=10 }=req.query
    const parsedLimit = parseInt(limit);
    const pageSkip=(page - 1)*parsedLimit;
    const allLikedVideos = await Like.find({video:req.user._id}).limit(parsedLimit);
    if(!allLikedVideos){
        throw new ApiError(404,"No videos likes")
    }
    res
    .status(200)
    .json(new ApiResponse(200,allLikedVideos,"Success"))
    
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}