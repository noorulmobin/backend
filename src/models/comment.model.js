import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const commentSchema= new Schema({
        content:{
            type:String,
            required:true
             },
        video:{
            type:Schema.Types.ObjectId,
            ref:"Videos" 
        },
        ownwe:{
            type:Schema.Types.ObjectId,
            ref:"User" 
        }

},{timestamps:true}
)


commentSchema.plugins(mongooseAggregatePaginate)

export const Comment=mongoose.model( "Comment",commentSchema)