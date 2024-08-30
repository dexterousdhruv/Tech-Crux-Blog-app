import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { deletePost, getPosts } from '../services/Api'
import { Button, Modal, Table } from 'flowbite-react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

const DashPosts = () => {
  const { currentUser } = useSelector(state => state.user)
  const [posts, setPosts] = useState([])
  const [showMore, setShowMore] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [deletePostId, setDeletePostId] = useState('')

  useEffect(() => {
    const fetchPosts = async () => {
      try {
  
        const res = await getPosts({userId: currentUser._id})
  
        if (res.status === 200) {
          setPosts(res.data.posts)
          if(res.data.posts.length < 9)
            setShowMore(false)
        }
  
      } catch (e) {
        console.log(e)
      }
    } 
  
    if (currentUser.isAdmin) fetchPosts()

  }, [])

  const handleShowMore = async () => {
    const startIndex = posts.length 

    try {
      const res = await getPosts({ userId: currentUser._id, startIndex })

      if (res.status === 200) {
        setPosts(prev => [...prev, ...res.data.posts])

        if(res.data.posts.length < 9)
          setShowMore(false)
      }

    } catch (e) {
      console.log(e)
    }
  }

  const handleDeletePost = async (postId) => {
    try {
       const res = await deletePost(postId, currentUser._id)

      if (res.status === 200) {
        setShowModal(false)
        setPosts(prev => 
          prev.filter(post => post._id !== postId)
        )
      }

    } catch (e) {
      console.log(e)
    }
  }


  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500  '>
      {currentUser.isAdmin && posts.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Category </Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className='divide-y'>
              {posts.map((post) => (
                <Table.Row key={post._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className='w-20 h-10 object-cover bg-gray-500'
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link className='font-medium text-gray-900 dark:text-gray-300' to={`/post/${post.slug}`}>{post.title}</Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() =>{
                        setShowModal(true)
                        setDeletePostId(post._id)
                      }}
                      className='font-medium text-red-500 hover:underline cursor-pointer '
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/update-post/${post._id}`}>
                      <span className='text-purple-500 hover:underline'>Edit</span>
                    </Link>
                  </Table.Cell>

                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {
            showMore && (
              <button onClick={handleShowMore} className='w-full text-purple-500 self-center  text-lg font-bold py-7'>
                Show more
              </button>
            )
          }
        </>          
      ):(
        <p>No posts yet!</p>
      )}
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
                <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this post? </h3>
                <div className="flex justify-center gap-4">
                  <Button color='failure' onClick={() => handleDeletePost(deletePostId)}>
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

export default DashPosts