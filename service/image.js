const path = require('path');
const multer = require('multer');

const upload = multer({ // 夾帶檔案到req.files
    limits: {
        fileSize: 2*1024*1024 // 圖片大小限制 (越小越好)
    },
    fileFilter: (req, file, cb) => { //cb 類似middleware
        const ext = path.extname(file.originalname).toLowerCase(); 
        if(!(['.jpg', '.jpeg', '.png'].includes(ext))) {
            cb(new Error('檔案格式錯誤：僅接受jpg, jpeg, png之格式'))
        }
        cb(null, true); 
    }
}).any(); //任何檔案類型

module.exports = upload
