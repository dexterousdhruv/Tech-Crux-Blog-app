import { model, Schema } from "mongoose";

const commentSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  postId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  likes: {
    type: Array,
    default: []
  },
  numberOfLikes: {
    type: Number,
    default: 0
  }
}, { versionKey: false, timestamps: true })

const Comment = model('Comment', commentSchema)

export default Comment 