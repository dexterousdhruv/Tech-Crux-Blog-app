import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const PrivateAdminRoute = () => {
  const {currentUser} = useSelector(state => state.user)

  return currentUser.isAdmin ? <Outlet/> : ( <Navigate to='/sign-in'/>)
}

export default PrivateAdminRoute 
 