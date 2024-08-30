import Post from "../models/post.model.js"
import { errorHandler } from "../utils/error.js"

export const createPost = async (req, res, next) => {
  const { userId, isAdmin, body: { content, title } } = req
 
  if (!isAdmin)
    return next(errorHandler(403, 'You are not allowed to create a post'))
  
  if(!title || !content)
    return next(errorHandler(403, 'Please provide all required fields'))

  const slug = title.split(" ").join("-").toLowerCase().replace(/[^a-zA-Z0-9-]/g, '')

  try { 
    const existingTitle = await Post.findOne({ title })

    if(existingTitle)
      return next(errorHandler(403, 'Title already taken'))

    const newPost = await new Post({ ...req.body, slug, userId }).save()
    res.status(201).json(newPost)

  } catch (e) {
    next(e)
  }
} 

export const getPosts = async (req, res, next) => {
  const { userId, category, slug, postId, searchTerm } = req.query

  try {
    const startIndex = parseInt(req.query.startIndex) || 0
    const limit =  parseInt(req.query.limit) || 9
    const sortDirection =  req.query.order === 'asc' ? 1 : -1

    const posts = await Post.find({
      ...(userId && { userId }), 
      ...(category && { category }),
      ...(slug && { slug }),
      ...(postId && { _id: postId }),
      ...(searchTerm && {
        $or: [
          { title: { $regex: searchTerm, $options: 'i' } },
          { content: { $regex: searchTerm, $options: 'i' } }
        ]
      }),
    }).sort({ updatedAt: sortDirection }).skip(startIndex).limit(limit)

    const totalPosts = await Post.countDocuments()

    const now = new Date()
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())

    const lastMonthPosts = await Post.countDocuments({ createdAt: { $gte: oneMonthAgo }})
       
    res.status(200).json({
      posts,  
      totalPosts,
      lastMonthPosts
    })

  } catch (e) {
    next(e)
  }
}

export const deletePost = async (req, res, next) => { 
  const { isAdmin, userId, params: { postId, user_id } } = req
  
  if (!isAdmin || userId !== user_id)
    return next(errorHandler(403, 'You are not allowed to delete this post'))

  try {
    await Post.findByIdAndDelete(postId)
    res.status(200).json('Post has been deleted') 

  } catch (e) {
    next(e)
  }
}


export const updatePost = async (req, res, next) => { 
  const { isAdmin, userId, params: { postId, user_id } } = req
  const  { title, content, image, category, slug} = req.body

  if (!isAdmin || userId !== user_id) 
    return next(errorHandler(403, 'You are not allowed to update this post'))

  try {
    const updatedPost = await Post.findByIdAndUpdate(postId,
      { $set: { title, category, content, image, slug } },
      { new : true }
    )

    res.status(200).json(updatedPost)

  } catch (e) {
    next(e)
  }

}