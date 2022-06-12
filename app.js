var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');//日誌
const cors = require('cors');

var postsRouter = require('./routes/posts');
var usersRouter = require('./routes/users');
const uploadRouter = require('./routes/upload');

var app = express();
require('./connections');

app.use(cors()); //header.js
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 程式出現重大錯誤時
process.on('uncaughtException', err => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
	console.error('Uncaughted Exception！')
	console.error(err);
	process.exit(1);
});

app.use('/posts', postsRouter);
app.use('/users', usersRouter);
app.use('/upload', uploadRouter);

app.use(function(req, res, next) {
  res.status(404).send({
    status: 'false',
    message: "找不到對應網址，請重新確認",
  });
});

//express 錯誤處理
//自己設定的err錯誤
const resErrorProd = (err, res) => {
  if(err.isOperational) {
    res.status(err.statusCode).send({
      message: err.message
    })
  } else {
    // log 紀錄
    console.error('出現重大錯誤',err);
    // 送出罐頭預設訊息
     res.status(500).send({
      status: 'error',
      message: '系統錯誤，請洽系統管理員'
  })
  }
}
//dev環境錯誤
const resErrorDev = (err, res) => {
  res.status(err.statusCode).send({
    message: err.message,
    error: err,
    stack: err.stack
  })
}
//判斷 dev/production 環境
app.use(function(err, req, res, next){
  //dev
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === 'dev'){
    return resErrorDev(err, res);
  }
  //production
  if(err.name === 'ValidationError'){
    err.message = '資料欄位未填寫正確，請重新輸入！'
    err.isOperational = true;
    return resErrorProd(err, res)
  }
  resErrorProd(err, res)
})

// 未捕捉到的 catch 
process.on('unhandledRejection', (reason, promise) => {
  console.error('未捕捉到的 rejection：', promise, '原因：', reason);
  // 記錄於 log 上
});

module.exports = app;
