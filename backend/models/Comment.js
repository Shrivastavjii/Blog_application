import mongoose from 'mongoose'
const userComment=new mongoose.Schema({

    content:{
        type:String,
        required:true,
    },

     blogId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Blog'
    },

    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
},{timestamps:true}
)

const Comment=mongoose.model('Comment',userComment)

export default Comment