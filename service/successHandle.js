function successHandle(res, msg, data) {
  res.send({ 
    status: true,
    msg,
    data
  }).end();
  // res.end();
}
module.exports = successHandle;
