const bcrypt = require('bcryptjs')
const validator = require('validator');
//Model
const User = require('../models/usersModel')
//service
const successHandle = require('../service/successHandle')
const appError = require('../service/appError')
const handleErrorAsync = require('../service/handleErrorAsync')
const { generateSendJWT } = require('../service/auth');

const getUsers = handleErrorAsync(async (req, res, next) => {
  const usersList = await User.find();
  if(!usersList) return next(appError(400, '尚未有用戶註冊', next));
  successHandle(res, '取得用戶列表成功', usersList);
})

const register = handleErrorAsync(async (req, res, next) => {
  let { email, password, confirmPassword, name } = req.body;
  if (!email || !password || !confirmPassword || !name) {
    return next(appError(400, '欄位未填寫正確', next));
  }
  // 密碼正確
  if (password !== confirmPassword) {
    return next(appError(400, '密碼不一致', next));
  }
  // 密碼要 8 碼以上
  if (!validator.isLength(password, { min: 8 })){
    return next(appError(400, '密碼字數少於 8 碼', next));
  }
  //密碼英文數字混合
  if(validator.isNumeric(password) || validator.isAlpha(password)){
    return next(appError(400, '密碼需英文數字混合', next));
  }
  // 是否為正確 Email 格式
  if (!validator.isEmail(email)) {
    return next(appError(400, 'Email 格式不正確', next));
  }
  //Email 是否重複註冊
  const hasEmail = await User.findOne({ email })
    if (hasEmail) return next(appError(400, 'Email 已被註冊', next));

  // 加密密碼
  password = await bcrypt.hash(req.body.password, 12);
  const newUser = await User.create({
    email,
    password,
    name
  });
  generateSendJWT(newUser, 201, res);
})

const login = handleErrorAsync(async (req, res, next) => {
  let { email, password } = req.body;
  if (!email || !password) {
    return next(appError(400, '帳號密碼需填寫', next));
  }
  if (!validator.isEmail(email)) {
    return next(appError(400, 'Email 格式不正確', next));
  }
  const user = await User.findOne({ email }).select('+password')
  if (!user) {
    return next(appError(400, '輸入的帳號或密碼不正確', next));
  }
  const auth = await bcrypt.compare(password, user.password)
  if (!auth) {
    return next(appError(400, '輸入的密碼不正確', next));
  }
  generateSendJWT(user, 200, res)
})

const updatePassword = handleErrorAsync(async (req, res, next) => {
  const { password, confirmPassword } = req.body
  const userId = req.user.id
  const checkUser = await User.findOne({ userId }).select('+password')
  const checkPsw = await bcrypt.compare(password, checkUser.password)
  if(checkPsw) return next(appError(400, '新密碼不得與舊密碼相同', next));

    if (!password || !confirmPassword) {
      return next(appError(400, '欄位未填寫正確', next))
    }
    if (!validator.isLength(password, { min: 8 })) {
      return next(appError(400, '密碼字數少於 8 碼', next))
    }
    if (validator.isNumeric(password) || validator.isAlpha(password)) {
      return next(appError(400, '密碼需英文數字混合', next))
    }
    if (password !== confirmPassword) {
      return next(appError(400, '密碼不一致', next))
    }
    const newPassword = await bcrypt.hash(password, 12)
    const user = await User.findByIdAndUpdate(userId, {
      password: newPassword,
    })
    generateSendJWT(user, 200, res)
})

const getProfile = handleErrorAsync(async (req, res, next) => {
  const userId = req.user.id
  const user = await User.findById(userId);
  successHandle(res, '取得個人資訊成功', user);
})

const updateProfile = handleErrorAsync(async (req, res, next) => {
const userId = req.user.id
    const { name, avatar, gender } = req.body
    if(!name.trim() || !validator.isLength(name, { min: 2 })){
      return next(appError(400, '暱稱為必填，且至少為兩字元', next));
    }
    if (!avatar && !gender) {
      return next(appError(400, '欄位未填寫正確', next))
    }
    const newProfile = await User.findOneAndUpdate({user: userId }, {
      name, avatar, gender },
      { 
        returnDocument: 'after',
        runValidators: true 
      });
    successHandle(res, '修改個人資訊成功', newProfile)
})

module.exports = {
  getUsers,
  register,
  login,
  updatePassword,
  getProfile,
  updateProfile
}
