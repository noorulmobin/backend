
import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { response } from "express"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    if (!videoId) {
        throw new ApiError(400, "Invalid video")
    }
    const {page = 1, limit = 10} = req.query
    const parsedLimit = parseInt(limit);
    const pageSkip = (page - 1) * parsedLimit;
    const allComments = await Comment.aggregate([
        {
            $match : {
                video : videoId,
            }

        },
        {
            $lookup : {
                from : "users",
                localField : "owner",
                foreignField : "_id",
                as : "owner",
                pipeline: [
                    
                    {
                        $project: {
                            userName: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $skip: pageSkip,
        },
        {
            $limit: parsedLimit,
        },

    ])
    if(!allComments){
        throw new ApiError(404,"No comments found")
    }
    res
    .status(200)
    .json(new ApiResponse(200, allComments,"success"))
})
  // TODO: add a comment to a video
const addComment = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const{content}= req.body
    if(!videoId || !content){
        throw new ApiError(400,"comment not found")
    }
    const comment= await comment.create({
        content:req.user,
        video:videoId
    })
    if(!comment){
        throw new ApiError(404,"comment is invalid")
    }
    res
    .status(200)
    .json(new ApiResponse(200,comment,"success"))

  
})

    // TODO: update a comment
const updateComment = asyncHandler(async (req, res) => {
    const {videoId} =req.params
    const{content} = req.body
    if(!videoId ||!content){
        throw new ApiError(400,"id not found")
    }

    const Comment= await Comment.findById(videoId);

    if(!Comment){
        throw new ApiError(400,"comment not found")
    }
      
    if(Comment.owner !==req.user){
        throw new ApiError(400,"you are not allowed to comment")
    }
    Comment.content = Comment
    try {
        await Comment.save();
    } catch (error) {
        throw new ApiError(503,`${error}`)
    }
    res
    .status(200)
    .json(new ApiResponse(200,Comment.save,"success"))
 
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {videoId}=req.params
    if(!videoId){
        throw new ApiError(403,"video not found")
    }

    if(Comment.owner !==req.user){
        throw new ApiError(403,"invalid owner")
    }
    try {
        await Comment.remove();
    } catch (error) {
        throw new ApiError(400,`remove coment${error}`)
    }
    res
    .status(200)
    .json(new ApiResponse(200,Comment.remove,"success"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    };
