import DashSidebar from '../components/DashSidebar'
import DashProfile from '../components/DashProfile'
import useTab from '../hooks/useTab'
import DashPosts from '../components/DashPosts'
import DashUsers from '../components/DashUsers'
import DashComments from '../components/DashComments'
import DashBoardComp from '../components/DashBoardComp'

const Dashboard = () => {
  const tab = useTab()

  return (
    <div className='min-h-screen flex flex-col md:flex-row '>
      {/* Sidebar */}
      <div className="md:w-56" >
        <DashSidebar />
      </div>

      {/* TAB */}
      {tab === 'profile' && <DashProfile />}
      {tab === 'posts' && <DashPosts />}
      {tab === 'users' && <DashUsers />}
      {tab === 'comments' && <DashComments />}
      {tab === 'dash' && <DashBoardComp />}
      
    </div>
  )
}

export default Dashboard