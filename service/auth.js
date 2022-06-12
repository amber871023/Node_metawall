const jwt = require('jsonwebtoken')
//Model
const User = require('../models/usersModel')
//service
const appError = require('../service/appError')
const handleErrorAsync = require('../service/handleErrorAsync')

const generateSendJWT = (user, statusCode, res) => {
  // 產生 token
  const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES
  });
  user.password = undefined;
  const data = {
    user: {
      token,
      name: user.name
    }
  }
  res.set('Authorization', 'Bearer ' + token);
  res.status(statusCode).json({
    status: 'success',
    data
  })  
}

const isAuth = handleErrorAsync(async (req, res, next) => {
  //確認 token 是否存在
  let token;
  const headersAuth = req.headers.authorization;
  if (headersAuth && headersAuth.startsWith('Bearer')) {
    token = headersAuth.split(' ')[1]; //取後段token
  }
  if (!token) return appError(401, '您尚未登入哦！', next);
  // 驗證 token 正確性
  const decoded = await new Promise((resolve, reject) => { //非promise物件，解密會有延遲故需打包為Promise
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
     if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) return appError(401, '登入異常', next);
  // 將user寫到req傳回
  req.user = currentUser;
  next();
})

module.exports = { generateSendJWT, isAuth }
