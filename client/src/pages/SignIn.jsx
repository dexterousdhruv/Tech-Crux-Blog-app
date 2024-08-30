import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signin } from '../services/Api'
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import OAuth from '../components/OAuth'
import Icon from '../components/Icon'


const SignIn = () => {
  const [formData, setFormData] = useState({})
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector(state => state.user)

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { email, password } = formData
    if (!email || !password) {
      return dispatch(signInFailure('Please fill out all fields!'))
    }

    try {
      dispatch(signInStart())
      const res = await signin(formData)

      if (res.status === 200) {
        dispatch(signInSuccess(res.data))
        navigate("/")
      }

    } catch (e) {
      let message = e.message

      if (e.response) { 
        const { status, statusText, data } = e.response
        message = (status === 500) ? statusText : data.message
      }

      dispatch(signInFailure(message))
    } 
  }



  return (
    <div className='min-h-screen mt-20 bg-none'> 
    <div className="flex flex-col gap-5 md:flex-row md:items-center p-3 max-w-3xl mx-auto">
      {/* LEFT */}
      <div className="basis-1/2">
      <Link to='/' className='flex items-center whitespace-nowrap text-6xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500  text-transparent bg-clip-text'>
        <h1 >Tech</h1>
        <Icon height={'h-10'} />
        <h1>rux</h1>
      </Link>

        <p className='text-md mt-5 text-gray-500 md:w-[22rem]'>
          You can sign in with your email and password or with Google.
        </p>
      </div>
      
      {/* RIGHT */}
      <div className="basis-1/2">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="">
            <Label value='Your email' />

            <TextInput
              type='email'
              placeholder='name@company.com'
              id='email'
              onChange={handleChange}
            />
          </div>
          <div className="">
            <Label value='Your password' />

            <TextInput
              type='password'
              placeholder='Password'
              id='password'
              onChange={handleChange}
            />
          </div>
          <Button gradientDuoTone={"purpleToPink"} type='submit' disabled={loading} >
            {loading ? 
              <>
                <Spinner size='sm' /> 
                <span className='pl-3'>Loading...</span>
              </> :
              "Sign In"}
          </Button>
          <OAuth />
        </form>
        <div className="flex gap-2 text-sm mt-5">
          <span>Don't have an account?</span>
          <Link to="/sign-up" className='text-blue-500'>
            Sign up
          </Link>
        </div>
        {
          error && (
            <Alert className='mt-5' color={'failure'}>
              {error}
            </Alert>
          )
        }
      </div>
    </div>
  </div>
  )
}

export default SignIn