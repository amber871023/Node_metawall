var express = require('express');
var router = express.Router();
//Controller
const uploadController = require('../controllers/uploadController')
//service
const { isAuth } = require('../service/auth.js')
const upload = require('../service/image');

router.post('/', isAuth, upload, uploadController.uploadImage);

module.exports = router;
