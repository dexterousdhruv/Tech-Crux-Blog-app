import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signup } from '../services/Api'
import OAuth from '../components/OAuth'
import { checkPasswordStrength } from '../utils/helpers'
import Icon from '../components/Icon'

const SignUp = () => {
  const [formData, setFormData] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const { username, email, password } = formData

    if (!username || !email || !password) {
      return setError('Please fill out all fields!')
    }

    if(checkPasswordStrength(password) !== "Password is strong")
      return setError(checkPasswordStrength(password))

    try {
      setLoading(true)
      const res = await signup(formData)
      
      if (res.status === 201) {
        setLoading(false)
        navigate("/sign-in")
      }

    } catch (e) {
      setLoading(false)
      let message = e.message

      if (e.response) {
        const { status, statusText, data } = e.response
        message = (status === 500) ? statusText : data.message
      }
      
      return setError(message)
    } 
  }

  return (
    <div className='min-h-screen mt-20'> 
      <div className="flex flex-col gap-5 md:flex-row md:items-center p-3 max-w-3xl mx-auto">
        {/* LEFT */}
        <div className="basis-1/2">
          <Link to='/' className='flex items-center whitespace-nowrap text-6xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500  text-transparent bg-clip-text'>
            <h1 >Tech</h1>
            <Icon height={'h-10'} />
            <h1>rux</h1>
        </Link>

          <p className='text-md mt-5 text-gray-500'>
            You can sign up with your email and password or with Google.
          </p>
        </div>
        
        {/* RIGHT */}
        <div className="basis-1/2">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="">
              <Label value='Your username' />

              <TextInput
                type='text'
                placeholder='Username'
                id='username'
                onChange={handleChange}
              />
            </div>
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
                "Sign Up"}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Already have an account?</span>
            <Link to="/sign-in" className='text-blue-500'>
              Sign in
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

export default SignUp