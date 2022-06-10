function errorHandle(res, msg){
    res.status(400).send({
        status: false,
        message: msg
    }).end();
}

module.exports = errorHandle;
