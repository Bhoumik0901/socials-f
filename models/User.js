const mongoose=require('mongoose');
let userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    likedPosts:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post", // References the Post model
            
        }
    ],
    yourPosts:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post", // References the Post model
            
        }
    ]

    
    
});
const User = mongoose.model('User', userSchema);
module.exports = User;
