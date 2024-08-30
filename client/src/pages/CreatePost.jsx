import { Alert, Button, FileInput, Label, Progress, Select, TextInput } from 'flowbite-react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { app } from '../firebase';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { createPost } from '../services/Api';


const CreatePost = () => {
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState('');
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState('');
  const [publishError, setPublishError] = useState('');
  const navigate = useNavigate()


  const uploadImage = async () => {
    setImageUploadError(null)

    if (!imageFile) {
      return setImageUploadError('Please select an image')
    }

    const storage = getStorage(app)
    const filename = new Date().getTime() + "_" + imageFile.name
    const storageRef = ref(storage, filename)  
    const uploadTask = uploadBytesResumable(storageRef, imageFile)
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setImageUploadProgress(progress.toFixed(0))
      },
      (error) => {
        console.log(error)
        setImageUploadError('Image upload failed')
        setImageUploadProgress(null)
        setImageFile(null)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
          setFormData({...formData, image: downloadURL})
          setImageUploadProgress(null)
          setImageUploadError(null)
        })
      },
    )
  }

  const handleChange = (e) => {
    if (e.target)
      setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }))
 
    else
      setFormData(prev => ({ ...prev, content: e }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setPublishError('')  

    try {   
      const res = await createPost(formData)

      if (res.status === 201) { 
        navigate(`/post/${res.data.slug}`)
      }
      
    } catch (e) {
      let message = e.message

      if (e.response) {
        const { status, statusText, data } = e.response
        message = (status === 500) ? statusText : data.message
      }
      setPublishError(message)
    }
    
  }

  return (
    <div className='p-3 max-w-3xl mx-auto '>
      <h1 className="text-center text-3xl my-7 font-semibold">Create a Post</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>

        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput type='text' placeholder='Title' required id='title' className='flex-1 ' onChange={handleChange} />
          
          <Select type='text' placeholder='Title' required id='category' className='flex-1 ' onChange={handleChange}>
            <option value="uncategorized">Select a category</option>
            <option value="javascript">Javascript</option>
            <option value="react">React</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>

        <div className="flex gap-4 items-center justify-between border-4  border-purple-400 border-dotted p-3">
          <FileInput type='file' accept='image/*' onChange={(e) => setImageFile(e.target.files[0])} />

          <Button type='button' gradientDuoTone={'purpleToBlue'} size='sm' outline onClick={uploadImage} disabled={imageUploadProgress}>
            Upload Image
          </Button>
        </div>

        <div className="text-center text-xl "> OR </div>
        
        <div className="flex  gap-4 items-center justify-between border-4  border-purple-400 border-dotted p-3">
          <TextInput type='text' placeholder='Paste image link here' required id='image' className='flex-1' onChange={handleChange} />
        
        </div>
        {imageUploadError && <Alert color={'failure'}>{imageUploadError}</Alert>}
        {formData.image && 
          <img
            src={formData.image}
            alt="upload" 
            className='w-full h-72 object-cover'
          />
        }

        {imageUploadProgress && 
          <Progress
            progress={imageUploadProgress}
            color='purple'
            size="lg"
            labelProgress
          />
        }
        <ReactQuill theme="snow" onChange={handleChange} required className='h-72 pb-12' />

        <Button type='submit' gradientDuoTone={'purpleToPink'} className='mt-5' >
          Publish
        </Button>
        {publishError && <Alert color={'failure'}>{publishError}</Alert>}


      </form>
    </div>
  )
}

export default CreatePost

