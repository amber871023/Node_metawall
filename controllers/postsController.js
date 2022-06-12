const Post = require('../models/postsModel')
const User = require('../models/usersModel')
const successHandle = require('../service/successHandle')
const appError = require('../service/appError')
const handleErrorAsync = require('../service/handleErrorAsync')

const getPosts = handleErrorAsync(async (req, res, next) => {  
  const { query } = req
  const keyword = query.q === undefined ? {} : { content: new RegExp(query.q) };
  const timeSort = query.timeSort === 'asc' ? 'createdAt' : '-createdAt'
  const allPosts = await Post.find(keyword).populate({
    path: 'user',
    select: 'name avatar'
  }).sort(timeSort);

  successHandle(res, '成功取得所有貼文', allPosts);
})

const createPost = handleErrorAsync(async (req, res, next) => { 
  const post = req.body;
  post.user = req.user.id;
  if(!post.content.trim()){
    return next(appError(400, '貼文內容為必填，且不得為空',next));
  };

  const newPost = await Post.create({
    ...post,
  })
  successHandle(res, '新增貼文成功', newPost);
})

const updatePost = handleErrorAsync(async (req, res, next) => {
  const postId = req.params.id;
  const { content } = req.body;
  const user = req.user.id;
  const checkPoster = await Post.findById(postId);
  const poster = checkPoster.user.toString()
  if(poster !== user){
    return next(appError(400, '您不可以修改其他使用者的貼文',next));
  }
  if(!content.trim()) return next(appError(400, '貼文內容為必填，且不得為空',next));
  const editedPost = await Post.findOneAndUpdate({
     _id: postId, user},
    {
      content
    },
    {
      returnDocument: 'after',
      runValidators:true
    });
  
  if(!editedPost) return next(appError(400, '貼文不存在或查無此使用者',next));
  successHandle(res, '修改貼文成功', editedPost);
})

const deletePosts = handleErrorAsync(async (req, res, next) => { 
  if(req.originalUrl === '/posts/') return next(appError(400, '無此路由',next));

  await Post.deleteMany({});
  successHandle(res,'刪除全部貼文成功', []);
})

const deletePost = handleErrorAsync(async (req, res, next) => { 
  const postId = req.params.id;
  const checkPoster = await Post.findById(postId);
  const poster = checkPoster.user.toString()
  const user = req.user.id;
  if(poster !== user){
    return next(appError(400, '您不可以刪除其他使用者的貼文',next));
  }
  const deleteOne = await Post.findByIdAndDelete(postId);
  if(!deleteOne) return next(appError(400, '查無此ID，刪除失敗',next));
      
  successHandle(res, '刪除該筆貼文成功', deleteOne);
})

module.exports = { getPosts, createPost, updatePost, deletePosts, deletePost };

