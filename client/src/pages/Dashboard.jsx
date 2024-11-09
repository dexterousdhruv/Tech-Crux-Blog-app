import DashSidebar from '../components/DashSidebar'
import DashProfile from '../components/DashProfile'
import useTab from '../hooks/useTab'
import DashPosts from '../components/DashPosts'
import DashUsers from '../components/DashUsers'
import DashComments from '../components/DashComments'
import DashBoardComp from '../components/DashBoardComp'

const Dashboard = () => {
  const tab = useTab()

  const displayTab = () => {
    switch (tab) {
      case 'profile':
        return <DashProfile />
      
      case 'posts':
        return <DashPosts />
      
      case 'users':
        return <DashUsers />
      
      case 'comments':
        return <DashComments />
      
      case 'dash':
        return <DashBoardComp />
    
      default:
        return <DashProfile />
    }
  }

  return (
    <div className='min-h-screen flex flex-col md:flex-row '>
      {/* Sidebar */}
      <div className="md:w-56" >
        <DashSidebar />
      </div>

      {/* TAB */}
      {displayTab()}
      
    </div>
  )
}

export default Dashboard