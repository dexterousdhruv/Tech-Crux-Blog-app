import { Sidebar } from 'flowbite-react'
import { HiAnnotation, HiArrowSmRight, HiChartPie, HiDocumentText, HiOutlineUserGroup, HiUser } from 'react-icons/hi'
import useTab from '../hooks/useTab.js'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signout } from '../services/Api.js'
import { signInSuccess } from '../redux/user/userSlice.js'

const DashSidebar = () => {
  const tab = useTab()
  const { currentUser } = useSelector(state => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSignout = async (e) => {
    try {
      const res = await signout()

      if (res.status === 200) {
        dispatch(signInSuccess())
        navigate('/sign-in')
      }

    } catch (e) {
      console.log(e)
    }
  }


  return (
    <Sidebar className='w-full drop-shadow-md'> 
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {currentUser && currentUser.isAdmin && 
            <Link to="/dashboard?tab=dash" >
              <Sidebar.Item as={'div'} className='mt-2' active={tab === 'dash' || !tab} icon={HiChartPie} >
                Dashboard
              </Sidebar.Item>
            </Link>  
          }
          <Link to="/dashboard?tab=profile" >
            <Sidebar.Item as={'div'} active={tab === 'profile'} icon={HiUser} label={currentUser.isAdmin ? "Admin" : "User"} labelColor='dark' >
              Profile
            </Sidebar.Item>
          </Link>  
          {currentUser && currentUser.isAdmin && 
            <Link to="/dashboard?tab=posts" >
              <Sidebar.Item as={'div'} className='mt-2' active={tab === 'posts'} icon={HiDocumentText} >
                Posts
              </Sidebar.Item>
            </Link>  
          }
          {currentUser && currentUser.isAdmin && 
            <Link to="/dashboard?tab=users" >
              <Sidebar.Item as={'div'} className='mt-2' active={tab === 'users'} icon={HiOutlineUserGroup} >
                Users
              </Sidebar.Item>
            </Link>  
          }
          {currentUser && currentUser.isAdmin && 
            <Link to="/dashboard?tab=comments" >
              <Sidebar.Item as={'div'} className='mt-2' active={tab === 'comments'} icon={HiAnnotation} >
                Comments
              </Sidebar.Item>
            </Link>  
          }
          <Sidebar.Item onClick={handleSignout}  icon={HiArrowSmRight} className="cursor-pointer" >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSidebar