var express = require('express');
var router = express.Router();
//Controller
const userController = require('../controllers/usersController')
//service
const { isAuth } = require('../service/auth.js')

router.get('/', isAuth, userController.getUsers)
router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/update-password', isAuth, userController.updatePassword)

router
  .route('/profile')
  .get(isAuth, userController.getProfile)
  .patch(isAuth, userController.updateProfile)


module.exports = router;
