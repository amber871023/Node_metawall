const sizeOf = require('image-size');
const { ImgurClient } = require('imgur');
const successHandle = require('../service/successHandle');
const appError = require('../service/appError')
const handleErrorAsync = require('../service/handleErrorAsync')

const uploadImage = handleErrorAsync(async (req, res, next) => {
  if (!req.files) {
    return next(appError(400, '尚未上傳檔案', next));
  }
  const dimensions = sizeOf(req.files[0].buffer);
  if ( dimensions.width < 300 ) return next(appError(400,'圖片寬至少300像素以上', next));
  if (dimensions.width !== dimensions.height) {
    return next(appError(400, '圖片長寬不符合 1:1 尺寸', next));
  }

  const client = new ImgurClient({
    clientId: process.env.IMGUR_CLIENTID,
    clientSecret: process.env.IMGUR_CLIENT_SECRET,
    refreshToken: process.env.IMGUR_REFRESH_TOKEN,
  });
  const response = await client.upload({
    image: req.files[0].buffer.toString('base64'), //將圖片轉成 base64 格式
    type: 'baset64',
    album: process.env.IMGUR_ALBUM_ID,
  });
  successHandle(res, '上傳圖片成功', {
      imageUrl: response.data.link,
    });
})

module.exports = { uploadImage }
