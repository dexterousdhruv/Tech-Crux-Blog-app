import { Router } from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createPost, deletePost, getPosts, updatePost } from "../controllers/post.controllers.js";

const router = Router()

router.post('/create', verifyToken, createPost)
router.get('/get-posts', getPosts)
router.delete('/delete/:postId/:user_id', verifyToken, deletePost)
router.put('/update/:postId/:user_id', verifyToken, updatePost)


export default router  