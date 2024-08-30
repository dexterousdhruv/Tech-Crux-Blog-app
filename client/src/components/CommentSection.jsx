import { HiOutlineExclamationCircle } from "react-icons/hi"
import { Alert, Button, Modal, Textarea } from "flowbite-react"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { createComment, deleteComment, getPostComments, likeComment } from "../services/Api"
import Comment from "./Comment"

const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector(state => state.user)
  const [comment, setComment] = useState('')
  const [postComments, setPostComments] = useState([])
  const [commentError, setCommentError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [deleteCommentId, setDeleteCommentId] = useState('')
  const navigate = useNavigate()

 
  const handleSubmit = async (e) => {
    e.preventDefault()
    setCommentError('')

    if(comment.length  > 200) return

    try {
      const data = { content: comment, postId, userId: currentUser._id }

      const res = await createComment(data)

      if (res.status === 201) {
        setComment('')
        setPostComments(prev => [res.data, ...prev])    
      }

    } catch (e) {
      let message = e.message

      if (e.response) { 
        const { status, statusText, data } = e.response
        message = (status === 500) ? statusText : data.message
      }

      setCommentError(message)
    }
  }
  
  useEffect(() => { 
    const fetchComments = async () => {
      setCommentError('')

      try {
        const res = await getPostComments(postId)

        if (res.status === 200) {
          setPostComments(res.data)
        }

      } catch (e) {
        let message = e.message

        if (e.response) { 
          const { status, statusText, data } = e.response
          message = (status === 500) ? statusText : data.message
        }

        setCommentError(message)
      }
    }
    fetchComments()
  }, [postId])

  const handleLike = async (commentId) => {
    try {
      if (!currentUser)
        return navigate('/sign-in')

      const res = await likeComment(commentId)
      
      if (res.status === 200) {
        setPostComments(postComments.map(comment => {
          return comment._id === commentId ? {
            ...comment,
            likes: res.data.likes,
            numberOfLikes: res.data.numberOfLikes
          } : comment
        }))
        console.log(res.data)
      }


    } catch (e) {
      console.log(e)      
    }
  }

  const handleEdit = (comment, editedContent) => {
    setPostComments(postComments.map(c => 
      c._id === comment._id ? {...c, content: editedContent}: c 
    ))
  }

  const handleDelete = async (commentId) => {
    try {
      if (!currentUser) return navigate('/sign-in')

      const res = await deleteComment(commentId)

      if (res.status === 200) {
        setPostComments(postComments.filter(c => c._id !== commentId))
        setShowModal(false)
      }

    } catch (e) {
      console.log(e)
    }
  }


  return (
    <div className="max-w-2xl mx-auto w-full  p-3">
      {currentUser ? 
        (
          <div className="flex items-center gap-1 my-5 text-gray-500 text-[14px] ">
            <p>Signed in as:</p>

            <img className="h-5 w-5 rounded-full" src={currentUser.profilePicture} alt="" />
            <Link
              to={`/dashboard?tab=profile`}
              className="text-xs text-cyan-500 hover:underline"
            >
              @{currentUser.username}
            </Link>
          </div>
        ) : (
          <div className="text-sm text-purple-500 my-5 ">
            You must be signed in to comment.  
            <Link to="/sign-in" className="text-blue-500 hover:underline ml-1">Sign In</Link>
          </div>
        )
      }
      {currentUser && 
        <form onSubmit={handleSubmit} className="border border-purple-500 rounded-md p-3 ">
          <Textarea
            placeholder="Add a comment..."
            rows={3}
            maxLength={'200'}
            onChange={e => setComment(e.target.value)}
            value={comment}
            className="resize-none text-slate-500 dark:text-slate-300"
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">{200 - comment.length} characters remaining</p>
            <Button outline gradientDuoTone={'purpleToBlue'} type="submit">
              Submit
            </Button>
          </div>
        {commentError && <Alert color={'failure'} className="my-5" >{commentError}</Alert>}
        </form>
      }
      {postComments.length === 0 ?
        (
          <p className="text-sm my-5">No comments yet</p>
        ) : (
          <>
            <div className="text-sm my-5 flex items-center gap-3">
              <p>Comments</p>
              <div className=" border border-gray-400 py-1 px-2 rounded-sm">
                <p>{postComments.length}</p>
              </div>
            </div>
            {
              postComments.map((comment) => (
                <Comment
                  key={comment._id}
                  comment={comment}
                  onLike={handleLike}
                  onEdit={handleEdit}
                  onDelete={(commentId) => {
                    setShowModal(true)
                    setDeleteCommentId(commentId)
                  }}
                />
              ))
            }
          </>
        )
      }
      {showModal &&
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          popup
          size={'md'}
        >
          <Modal.Header  />
            <Modal.Body >
              <div className="text-center">
                <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto ' />
                <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this comment? </h3>
                <div className="flex justify-center gap-4">
                  <Button color='failure' onClick={() => handleDelete(deleteCommentId)}>
                    Yes, I'm sure
                  </Button>
                  <Button color='gray' onClick={() => setShowModal(false)}>
                    No, cancel
                  </Button>
                </div>
              </div>
            </Modal.Body>
        </Modal>
      }
    </div>
    
  )
}

export default CommentSection  