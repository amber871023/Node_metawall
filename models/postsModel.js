const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    user:{ 
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, '貼文ID未填寫']
    },
    content:{ 
      type: String,
      required: [true, '貼為內容未填寫']
    },
    image:{
      type: String,
      default: ""
    },
    createdAt: {
      type: Number,
    },
    updatedAt: {
      type: Number,
    },
    likes:{ //按讚數
      type: Number,
      default: 0
    },
    comments:{
      type: Number,
      default: 0
    }
  },
  {
    versionKey: false,
    timestamps: {
      currentTime: () => Date.now(),
    },
  }
)

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
