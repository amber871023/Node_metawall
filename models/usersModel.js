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
    gender: {
      type: String,
      enum: ['male', 'female']
    },
    password: {
      type: String,
      required: [true, '請輸入密碼'],
      minlength: [8, '密碼至少 8 碼以上'],
      select: false
    },
    createdAt: { //轉為 Timestamp
      type: Number,
    },
    updatedAt: { //轉為 Timestamp
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
