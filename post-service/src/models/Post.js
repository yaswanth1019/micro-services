const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    content : {
        type : String,
        required : true,
    },
    mediaIds : [
        {
            type : String
        }
    ],
    createdAt : {
        type : Date,
        default : Date.now()
    }
},{timestamps : true})


// if search service is implemented then we can omit this line 
postSchema.index({content : 'text'})

const Post = mongoose.model('Post',postSchema);

module.exports = Post;