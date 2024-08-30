import { Button, Dropdown, Navbar, TextInput } from 'flowbite-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { RiSearchLine } from "react-icons/ri";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signInSuccess } from '../redux/user/userSlice';
import { signout } from '../services/Api';
import { useEffect, useState } from 'react';
import Icon from './Icon';

const Header = () => {
  const location = useLocation()
  const path = location.pathname
  const { currentUser } = useSelector(state => state.user)
  const { theme } = useSelector(state => state.theme)
  const [searchTerm, setSearchTerm] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTermFromUrl = urlParams.get('searchTerm')
    if(searchTermFromUrl)
      setSearchTerm(searchTermFromUrl)


  }, [location.search])

  const handleSignout = async () => {
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

  const handleSubmit = (e) => {
    e.preventDefault()
    const urlParams = new URLSearchParams(location.search)
    urlParams.set('searchTerm', searchTerm)
    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)
  }
 
  return (
    <Navbar className='border-b-2'>
      <Link to='/' className='  flex items-center whitespace-nowrap text-sm sm:text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500  text-transparent bg-clip-text'>
        <h1 >Tech</h1>
        <Icon height={'h-3 sm:h-5'} />
        <h1>rux</h1>
      </Link>
      <form onSubmit={handleSubmit} >
        <TextInput
          type='text'
          placeholder='Search'
          rightIcon={RiSearchLine}
          className='hidden lg:inline'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <Button className='w-12 h-10 lg:hidden' color={'gray'} pill>
        <RiSearchLine/>
      </Button>

      <div className='flex gap-2 md:order-2'>
        <Button
          pill
          color='gray'
          className="w-12 h-10 hidden sm:inline"
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === 'light' ? <FaSun /> : <FaMoon/>}
        </Button>
        {currentUser ?
          (
            <Dropdown
              arrowIcon={false}
              inline 
              label={
                <img src={currentUser.profilePicture}
                  alt="user"
                  className='w-10 h-10 object-cover rounded-full'
                />
              }
            >
              <Dropdown.Header>
                <span className='block text-sm' >@{currentUser.username}</span>
              </Dropdown.Header>
              <Dropdown.Item>
                <span className='block text-sm font-medium truncate' >
                  {currentUser.email}
                </span>
              </Dropdown.Item>
              <Link to='/dashboard?tab=profile' >
                <Dropdown.Item>
                  Profile
                </Dropdown.Item>
              </Link>
              <Dropdown.Item onClick={handleSignout}>
                Sign out
              </Dropdown.Item>
            </Dropdown>
          ) :
          (
            <Link to='/sign-in' >
              <Button outline gradientDuoTone='purpleToBlue'>
               Sign In 
              </Button>
             </Link>
          )
        }
       
        <Navbar.Toggle />
      </div>
        <Navbar.Collapse>
          <Navbar.Link active={ path === "/" } as={'div'} className='text-base' >
            <Link to='/' >Home</Link>
          </Navbar.Link>
          <Navbar.Link active={ path === "/about" } as={'div'} className='text-base' >
            <Link to='/about' >About</Link>
          </Navbar.Link>
          <Navbar.Link active={ path === "/projects" } as={'div'} className='text-base' >
            <Link to='/projects' >Projects</Link>
          </Navbar.Link>
        </Navbar.Collapse>
    </Navbar>
  )
}

export default Header