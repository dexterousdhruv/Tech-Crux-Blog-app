import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getComments, getPosts, getUsers } from '../services/Api'
import { HiAnnotation, HiArrowNarrowUp, HiDocumentText, HiOutlineUserGroup } from 'react-icons/hi'
import { Button, Table } from 'flowbite-react'
import { Link } from 'react-router-dom'

const DashBoardComp = () => {
  const [users, setUsers] = useState([])
  const [comments, setComments] = useState([])
  const [posts, setPosts] = useState([])

  const [totalUsers, setTotalUsers] = useState(0)
  const [totalComments, setTotalComments] = useState(0)
  const [totalPosts, setTotalPosts] = useState(0)
   
  const [lastMonthUsers, setLastMonthUsers] = useState(0)
  const [lastMonthComments, setLastMonthComments] = useState(0)
  const [lastMonthPosts, setLastMonthPosts] = useState(0)

  const { currentUser } = useSelector(state => state.user)

   
  useEffect(() => { 
    const fetchUsers = async () => {
      try {
        const res = await getUsers({limit: 5})
  
        if (res.status === 200) {
          setUsers(res.data.users)
          setTotalUsers(res.data.totalUsers)
          setLastMonthUsers(res.data.lastMonthUsers)

        }
  
      } catch (e) {
        console.log(e)
      }
    } 
    const fetchPosts = async () => {
      try {
        const res = await getPosts({ limit: 5 })
    
        if (res.status === 200) {
          setPosts(res.data.posts)
          setTotalPosts(res.data.totalPosts)
          setLastMonthPosts(res.data.lastMonthPosts)
     
        }
  
      } catch (e) {
        console.log(e)
      }
    } 

    const fetchComments = async () => {
      try {
        const res = await getComments({ limit: 5})
  
        if (res.status === 200) {
          setComments(res.data.comments)
          setTotalComments(res.data.totalComments)
          setLastMonthComments(res.data.lastMonthComments)
  
        }
  
      } catch (e) {
        console.log(e)
      }
    }
    

    if (currentUser.isAdmin) {
      fetchUsers()
      fetchPosts()
      fetchComments()
    }
  
    
  },[currentUser])

  return (
    <div className="p-3 md:mx-auto">
      <div className="flex flex-wrap justify-center gap-4 text-slate-500 dark:text-slate-200 ">
        <div className='flex flex-col p-3 dark:bg-slate-700 gap-4 md:w-72 w-full rounded-md shadow-md'>
          <div className="flex justify-between">
            <div>
              <h3 className=' text-md uppercase '>Total Users</h3>
              <p className='text-2xl'>{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className='bg-orange-400 text-white rounded-full  text-5xl p-3 shadow-lg'/>
          </div>

          <div className="flex gap-2 text-sm">
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp/>
              {lastMonthUsers}
            </span>
            <div className=''>Last Month</div>
          </div>
        </div>

        <div className='flex flex-col p-3 dark:bg-slate-700 gap-4 md:w-72 w-full rounded-md shadow-md'>
          <div className="flex justify-between">
            <div className="">
              <h3 className='text-md uppercase '>Total Comments</h3>
              <p className='text-2xl'>{totalComments}</p>
            </div>
            <HiAnnotation className='bg-indigo-500 text-white rounded-full  text-5xl p-3 shadow-lg'/>
          </div>

          <div className="flex gap-2 text-sm">
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp/>
              {lastMonthComments}
            </span>
            <div className=''>Last Month</div>
          </div>
        </div>

        <div className='flex flex-col p-3 dark:bg-slate-700 gap-4 md:w-72 w-full rounded-md shadow-md'>
          <div className="flex justify-between">
            <div className="">
            <h3 className='text-md uppercase '>Total Posts</h3>
            <p className='text-2xl'>{totalPosts}</p>
            </div>
            <HiDocumentText className='bg-fuchsia-500 text-white rounded-full  text-5xl p-3 shadow-lg'/>
          </div>

          <div className="flex gap-2 text-sm">
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp/>
              {lastMonthPosts}
            </span>
            <div className=''>Last Month</div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold  ">
            <h1 className='text-center p-2'>Recent Users</h1>
            <Button outline gradientDuoTone={'purpleToPink'}>
              <Link to={`/dashboard?tab=users`}> See all </Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            <Table.Body className='divide-y'>
              {users && users.map(user => (
                <Table.Row key={user._id}>
                  <Table.Cell>
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className='w-10 h-10 rounded-full object-cover bg-gray-50'
                    />
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold  ">
            <h1 className='text-center p-2'>Recent Comments</h1>
            <Button outline gradientDuoTone={'purpleToPink'}>
              <Link to={`/dashboard?tab=comments`}> See all </Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            <Table.Body className='divide-y'>
              {comments && comments.map(comment => (
                <Table.Row key={comment._id}>
                  <Table.Cell className='w-96'>
                    <p className="line-clamp-2">{comment.content}</p>
                  </Table.Cell>
                  <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold  ">
            <h1 className='text-center p-2'>Recent Posts</h1>
            <Button outline gradientDuoTone={'purpleToPink'}>
              <Link to={`/dashboard?tab=posts`}> See all </Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Post category</Table.HeadCell>
            </Table.Head>
            <Table.Body className='divide-y'>
              {posts && posts.map(post => (
                <Table.Row key={post._id}>
                  <Table.Cell>
                    <img
                      src={post.image}
                      alt={post.slug}
                      className='w-14 h-10 rounded-md object-cover bg-gray-50'
                    />
                  </Table.Cell>
                  <Table.Cell className='w-96'>{post.title}</Table.Cell>
                  <Table.Cell className='w-5'>{post.category}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default DashBoardComp