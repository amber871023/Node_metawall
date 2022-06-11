var express = require('express');
var router = express.Router();
//Controller
const PostsControllers = require('../controllers/postsController')

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router
  .route('/')
  .get(PostsControllers.getPosts)
  .post(PostsControllers.createPost)
  .delete(PostsControllers.deletePosts)
  
router
  .route('/:id')
  .patch(PostsControllers.updatePost)
  .delete(PostsControllers.deletePost)

module.exports = router;
