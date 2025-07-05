const express = require('express');
const authenticateRequest = require('../middleware/authMiddleware');
const { createPost, getAllPosts, getPost, deletePost } = require('../controllers/post-contoller');
const router = express.Router();

router.use(authenticateRequest);

router.post('/create-post', createPost);
router.get('/all-posts', getAllPosts);
router.get('/:postId',getPost);
router.delete('/delete/:postId',deletePost)

module.exports = router;