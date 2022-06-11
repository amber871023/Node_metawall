const appError = (httpStatus, errMessage, next)=>{
    const error = new Error(errMessage);
    error.statusCode = httpStatus;
    error.isOperational = true;
    //將 error 交給 app.js 中的錯誤處理 middleware 回傳錯誤訊息
    next(error);
}

module.exports = appError;
