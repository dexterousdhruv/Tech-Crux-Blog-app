import { Alert, Button, Modal, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from '../firebase'
import { CircularProgressbar } from "react-circular-progressbar"
import 'react-circular-progressbar/dist/styles.css'
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signInSuccess, updateFailure, updateStart, updateSuccess } from '../redux/user/userSlice';
import { deleteUser, signout, updateUser } from '../services/Api';
import { HiOutlineExclamationCircle } from 'react-icons/hi'

const DashProfile = () => {
  const { currentUser, error, loading } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({})
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
  const [showModal, setShowModal] = useState(false)

  //States for handling image input
  const [imageFile, setImageFile] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [imageUploadProgress, setImageUploadProgress] = useState(null)
  const [imageUploadError, setImageUploadError] = useState(null)
  const filePickerRef = useRef()

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setImageFile(file)
    setImageUrl(URL.createObjectURL(file))
  }

  useEffect(() => {
    if (imageFile)
      uploadImage()
  }, [imageFile])

  const uploadImage = async () => {    
    setImageUploadError(null)

    const storage = getStorage(app)
    const filename = new Date().getTime() + "_" + imageFile.name
    const storageRef = ref(storage, filename)
    const uploadTask = uploadBytesResumable(storageRef, imageFile)
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setImageUploadProgress(progress.toFixed(0))
      }, 
      (error) => {
        setImageUploadError('Could not upload image (File must be less than 2MB)')
        setImageUploadProgress(null)
        setImageFile(null)
        setImageUrl(null)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
          setImageUrl(downloadURL)
          setFormData({...formData, profilePicture: downloadURL })
          setImageUploadProgress(null)
        })
      }

    )
  }

  const handleChange = (e) => {    
    setFormData({...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUpdateUserSuccess(null)

    if (Object.keys(formData).length === 0) { 
      return dispatch(updateFailure('No changes made!'))
    }
    
    if (imageUploadProgress) {
      return dispatch(updateFailure('Please wait for the image to upload!'))
    }

    try {
      dispatch(updateStart())

      const res = await updateUser(currentUser._id, formData)

      if (res.status === 200) { 
        dispatch(updateSuccess(res.data))
        setUpdateUserSuccess('User profile updated successfully!')
      }

      
    } catch (e) {
      console.log(e)
      const { status, statusText, data } = e.response
      const message = (status === 500) ? statusText : data.message

      dispatch(updateFailure(message))
    }
  } 
  
  const handleDeleteUser = async () => {
    setShowModal(false)

    try {
      dispatch(deleteUserStart())

      const res = await deleteUser(userId)

      if (res.status === 200) 
        dispatch(deleteUserSuccess(res.data))

    } catch (e) {
      const { status, statusText, data } = e.response
      const message = (status === 500) ? statusText : data.message

      dispatch(deleteUserFailure(message))
    }
  }

  const handleSignout = async (e) => {
    try {
      const res = await signout()

      if (res.status === 200) 
        dispatch(signInSuccess())

    } catch (e) {
      console.log(e.message)
    }
  }

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      
      <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
        <input
          type="file"
          accept="image/*"
          ref={filePickerRef}
          onChange={handleImageChange}
          className='hidden'
        />

        <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full" onClick={() => filePickerRef.current.click()}>
          {imageUploadProgress && 
            <CircularProgressbar
              value={imageUploadProgress || 0}  
              text={`${imageUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  fontWeight: 'bold'
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${imageUploadProgress / 100})`,
                }
              }}
            >
              
            </CircularProgressbar>
          }
            <img
              src={imageUrl || currentUser.profilePicture }
              alt="profile-picture"
              className={`rounded-full w-full h-full object-cover border-8 border-gray-200`}
              />
        </div>
        {
          imageUploadError && <Alert color={'failure'}>{imageUploadError}</Alert>
        }


        <TextInput
          type='username'
          placeholder='username'
          id='username'
          defaultValue={currentUser.username}
          onChange={handleChange}
        />

        <TextInput
          type='email'
          placeholder='name@company.com'
          id='email'
          defaultValue={currentUser.email}
          onChange={handleChange}
        />

        <TextInput
          type='password'
          placeholder='password'
          id='password'
          onChange={handleChange}
        />

        <Button gradientDuoTone={"purpleToBlue"} disabled={loading || imageUploadProgress} outline type='submit'>
          {loading ? 'Loading...' : 'Update'}
        </Button>

        {currentUser.isAdmin && 
          <Link to='/create-post' >
            <Button type='button' className='w-full' gradientDuoTone={"purpleToPink"} >
              Create Post
            </Button>
          </Link>
        }
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span onClick={() => setShowModal(true)} className='cursor-pointer'>Delete Account</span>
        <span onClick={handleSignout} className='cursor-pointer'>Sign Out</span>
      </div>

      {/* --------------Alerts for success/failure---------------- */}

      {updateUserSuccess && (
        <Alert className='mt-5' color={'success'}>
          {updateUserSuccess}
        </Alert>
      )}
      {error && (
        <Alert className='mt-5' color={'failure'}>
        {error}
        </Alert>
      )}

      {/* --------------Popup for deleting user---------------- */}

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size={'md'}
      >
        <Modal.Header />
          <Modal.Body >
            <div className="text-center">
              <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto ' />
              <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete your account ? </h3>
              <div className="flex justify-center gap-4">
                <Button color='failure' onClick={handleDeleteUser}>
                  Yes, I'm sure
                </Button>
                <Button color='gray' onClick={() => setShowModal(false)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
      </Modal>
    </div>
  )
}

export default DashProfile