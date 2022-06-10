const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '暱稱必填']
    },
    email: {
      type: String,
      required: [true, 'Email必填'],
      unique: true,
      lowercase: true,
      select: false
    },
    avatar: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Number,
    },
  },
  {
    versionKey: false,
    timestamps: {
      currentTime: () => Date.now(),
    },
  }
)

const User = mongoose.model('User', userSchema);

module.exports = User;
