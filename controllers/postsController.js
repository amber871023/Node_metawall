const Post = require('../models/postsModel')
const User = require('../models/usersModel')
const successHandle = require('../service/successHandle') 
const errorHandle = require('../service/ErrorHandle')

const getPosts = async (req,res) =>{
  const { query } = req
  const keyword = query.q === undefined ? {} : { content: new RegExp(query.q) };
  const timeSort = query.timeSort === 'asc' ? 'createdAt' : '-createdAt'
  const allPosts = await Post.find(keyword).populate({
    path: 'user',
    select: 'name avatar'
  }).sort(timeSort);

  successHandle(res, '成功取得所有貼文', allPosts);
}
const createPost = async (req, res) =>{
  try{
    const post = req.body;
    if(!post.content || !post.user){
      errorHandle(res , '貼文內容及使用者為必填');
      return; 
    };
    const checkUser = await User.findById(post.user);
        if(!checkUser) {
            errorHandle(res, '查無此使用者');
        }
    const newPost = await Post.create({
      ...post,
    })
    successHandle(res, newPost);
  }catch{
    errorHandle(res, '新增貼文失敗')
  }
}
const deletePosts = async (req, res) =>{
  if(req.originalUrl === '/posts/'){
    errorHandle(res, '無此路由')
  }else{
    await Post.deleteMany({});
    successHandle(res,'刪除全部貼文成功', []);
  }
}
const deletePost = async (req, res) =>{
  try{
    const id = req.params.id;
    const deleteOne = await Post.findByIdAndDelete(id);
    if(!deleteOne){
      errorHandle(res, '查無此ID，刪除失敗');
    }else{
      successHandle(res, '刪除該筆貼文成功', deleteOne);
    }
  }catch{
    errorHandle(res, '查無此ID，刪除失敗');
  }
}

module.exports = { getPosts, createPost, deletePosts, deletePost };

