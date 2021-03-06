const express = require('express');
const postsRouter = express.Router();
const { getAllPosts } = require('../db/index');
const { requireUser } = require('./utils');



postsRouter.post('/', requireUser, async (req, res, next) => {
  const { title, content, tags = "" } = req.body;

  const tagArr = tags.trim().split(/\s+/)
  const postData = {};

  // only send the tags if there are some to send
  if (tagArr.length) {
    postData.tags = tagArr;
  }

  try {

    postData.id = req.user.id;
    postData.title = title;
    postData.content = content;
    if (post){
      res.send({ post });
    } else {
      next({
        name: 'Post / Tag creation error',
        message: `Post with tags was not properly formed`
      });
    }


    // add authorId, title, content to postData object
    // const post = await createPost(postData);
    // this will create the post and the tags for us
    // if the post comes back, res.send({ post });
    // otherwise, next an appropriate error object 
  } catch ({ name, message }) {
    next({ name, message });
  }
});



postsRouter.use((req, res, next) => {
    console.log("A request is being made to /posts");
  
    next(); 
  });
  
postsRouter.get('/', async (req, res) => {
    const posts = await getAllPosts();
  
    res.send({
      posts
    });
  });

module.exports = postsRouter;