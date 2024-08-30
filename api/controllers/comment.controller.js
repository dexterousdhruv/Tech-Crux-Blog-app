
import Comment from "../models/comment.model.js"
import { errorHandler } from "../utils/error.js"

export const createComment = async (req, res, next) => {
  const { userId } = req
  const { userId: user_id , content, postId } = req.body

  if(userId !== user_id)
    return next(errorHandler(403, 'You are not allowed to create this comment'))

  try {
    const newComment = await Comment({
      content,
      postId,
      userId
    }).save()
    
    res.status(201).json(newComment)
    
  } catch (e) {
    next(e)
  }
}

export const getPostComments = async (req, res, next) => {
  const { postId } = req.params

  try {
    const comments = await Comment.find({ postId }).sort({ createdAt: -1 })
    
    res.status(200).json(comments)

  } catch (e) {
    next(e)
  }
}


export const likeComment = async (req, res, next) => {
  const { userId } = req
  const { commentId } = req.params

  try {
    const comment = await Comment.findById(commentId)
    if (!comment)
      return (next(errorHandler(404, 'Comment not found')))

    const userIndex = comment.likes.indexOf(userId)

    if (userIndex === -1) {
      comment.numberOfLikes += 1
      comment.likes.push(userId)
    } else {
      comment.numberOfLikes -= 1
      comment.likes.splice(userIndex, 1)
    }

    await comment.save()

    res.status(200).json(comment)

  } catch (e) {
    
  }
}

export const editComment = async (req, res, next) => {
  const { userId , isAdmin, body: { content } } = req
  const { commentId } = req.params

  try {
    const comment = await Comment.findById(commentId)
    if (!comment)
      return (next(errorHandler(404, 'Comment not found')))

    if (!isAdmin || userId !== comment.userId)
      return next(errorHandler(403, 'You are not allowed to edit this comment'))

    const editedComment = await Comment.findByIdAndUpdate(commentId, { content }, { new: true })
    
    res.status(200).json(editedComment)
  } catch (e) {
    
  }

}

export const deleteComment = async (req, res, next) => {
  const { isAdmin, userId, params: { commentId }} = req
  
  try {
    const comment = await Comment.findById(commentId) 
    if (!comment)
      return (next(errorHandler(404, 'Comment not found')))

    if (!isAdmin || userId !== comment.userId)
      next(errorHandler(403, 'You are not allowed to delete this user'))

    await Comment.findByIdAndDelete(commentId)

    res.status(200).json('Comment has been deleted')

  } catch (e) {
    next(e)
  }
}


export const getComments = async (req, res, next) => { 
  const { isAdmin } = req

  if(!isAdmin) 
    next(errorHandler(403, 'You are not allowed to get comments!'))

  try {
    const startIndex = parseInt(req.query.startIndex) || 0
    const limit = parseInt(req.query.limit) || 9
    const sortDirection = req.query.order === 'asc' ? 1 : -1

    const comments = await Comment.find()
    .sort({ createdAt: sortDirection}).skip(startIndex).limit(limit)

    const totalComments = await Comment.countDocuments()

    const now = new Date()
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())

    const lastMonthComments = await Comment.countDocuments({ createdAt: { $gte: oneMonthAgo }})
 
    res.status(200).json({
      comments,
      totalComments,
      lastMonthComments 
    })

  } catch (e) {
    next(e)
  }
}

