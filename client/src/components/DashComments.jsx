import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { deleteComment, getComments } from '../services/Api'
import { Button, Modal, Table } from 'flowbite-react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'


const DashComments = () => {
  const { currentUser } = useSelector(state => state.user)
  const [comments, setComments] = useState([])
  const [showMore, setShowMore] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [deleteCommentId, setDeleteCommentId] = useState('')

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await getComments()
  
        if (res.status === 200) {
          setComments(res.data.comments)
          if(res.data.comments.length < 9)
            setShowMore(false)
        }
  
      } catch (e) {
        console.log(e)
      }
    } 
  
    if (currentUser.isAdmin) fetchComments() 

  }, [])

  const handleShowMore = async () => {
    const startIndex = comments.length 

    try {
      const res = await getComments({ startIndex })

      if (res.status === 200) {
        setComments(prev => [...prev, ...res.data.posts])

        if(res.data.posts.length < 9)
          setShowMore(false)
      }

    } catch (e) {
      console.log(e)
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await deleteComment(commentId)

      if (res.status === 200) {
        setShowModal(false)
        setComments(prev => 
          prev.filter(comment => comment._id !== commentId)
        )
      }

    } catch (e) {
      console.log(e)
    }
  }


  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500  '>
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Number of Likes</Table.HeadCell>
              <Table.HeadCell>PostId</Table.HeadCell>
              <Table.HeadCell>UserId</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className='divide-y'>
              {comments.map((comment) => (
                <Table.Row key={comment._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell className=''>
                    <p>{comment.content}</p>
                  </Table.Cell>
                  <Table.Cell className='font-medium text-gray-900 dark:text-gray-300' >
                    {comment.numberOfLikes}
                  </Table.Cell>
                  <Table.Cell> {comment.postId} </Table.Cell>
                  <Table.Cell>{comment.userId}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() =>{
                        setShowModal(true)
                        setDeleteCommentId(comment._id)
                      }}
                      className='font-medium text-red-500 hover:underline cursor-pointer '
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {
            showMore && (
              <button onClick={handleShowMore} className='w-full text-purple-500 self-center text-lg font-bold py-7'>
                Show more
              </button>
            )
          }
        </>          
      ):(
        <p>No comments  yet!</p>
      )}
      {showModal &&
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          popup
          size={'md'}
        >
          <Modal.Header />
            <Modal.Body >
              <div className="text-center">
                <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
                <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                  Are you sure you want to delete this user?
                </h3>
                <div className="flex justify-center gap-4">
                  <Button color='failure' onClick={() => handleDeleteComment(deleteCommentId)}>
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

export default DashComments