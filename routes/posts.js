var express = require('express');
var router = express.Router();
//Controller
const PostsControllers = require('../controllers/postsController')
//service
const { isAuth } = require('../service/auth.js')

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router
  .route('/')
  .get(isAuth, PostsControllers.getPosts)
  .post(isAuth, PostsControllers.createPost)
  .delete(isAuth, PostsControllers.deletePosts)
  
router
  .route('/:id')
  .patch(isAuth, PostsControllers.updatePost)
  .delete(isAuth, PostsControllers.deletePost)

module.exports = router;
