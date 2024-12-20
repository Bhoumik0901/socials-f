const mongoose=require('mongoose');
let postsSchema= new mongoose.Schema({
    image:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    likesCount:{
        type:Number,
        default:0
    },
    comments:[{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Comment', // Reference to the Post model 
    }]
    
    
});
const Post = mongoose.model('Post', postsSchema);
module.exports = Post;
