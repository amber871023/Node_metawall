var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');//日誌
const cors = require('cors');

var postsRouter = require('./routes/posts');
var usersRouter = require('./routes/users');

var app = express();
require('./connections');

app.use(cors()); //header.js
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/posts', postsRouter);
app.use('/users', usersRouter);

app.use(function(req, res, next) {
  res.status(404).json({
    status: 'false',
    message: "找不到對應網址，請重新確認",
  });
});

module.exports = app;
