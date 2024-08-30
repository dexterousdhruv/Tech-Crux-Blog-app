import {
  Alert,
  Button,
  FileInput,
  Progress,
  Select,
  TextInput,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { getPosts, updatePost } from "../services/Api";


const UpdatePost = () => {
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState("");
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState("");
  const [publishError, setPublishError] = useState("");
  const navigate = useNavigate();
  const { postId } = useParams();

  useEffect(() => {
  
    const fetchPost = async () => {
      setPublishError('')
      
      try {
        const res = await getPosts({ postId })

        if (res.status === 200) {
          setFormData(res.data.posts[0])
        }

      } catch (e) {
        const { status, statusText, data } = e.response;
        const message = status === 500 ? statusText : data.message;
        setPublishError(message);
      }
    }

    fetchPost()

  }, [postId]);

  const uploadImage = async () => {
    setImageUploadError(null);

    if (!imageFile) {
      return setImageUploadError("Please select an image");
    }

    const storage = getStorage(app);
    const filename = new Date().getTime() + "_" + imageFile.name;
    const storageRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(progress.toFixed(0));
      },
      (error) => {
        console.log(error);
        setImageUploadError("Image upload failed");
        setImageUploadProgress(null);
        setImageFile(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, image: downloadURL });
          setImageUploadProgress(null);
          setImageUploadError(null);
        });
      }
    );
  };

  const handleChange = (e) => {    
    if (e.target)
      setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }))
 
    else  // for react quill component
      setFormData(prev => ({ ...prev, content: e }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPublishError("");

    try {
      const res = await updatePost(postId, formData.userId, formData);

      if (res.status === 200) {
        navigate(`/post/${res.data.slug}`)
      }

    } catch (e) {
      let message = e.message

      if (e.response) {
        const { status, statusText, data } = e.response
        message = (status === 500) ? statusText : data.message
      }
      setPublishError(message);
    }
  };


  return (
    <div className="p-3 max-w-3xl mx-auto ">
      <h1 className="text-center text-3xl my-7 font-semibold">Update Post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1 "
            onChange={handleChange}
            value={formData.title}
          />

          <Select
            type="text"
            placeholder="Title"
            required
            id="category"
            className="flex-1 "
            onChange={handleChange}
            value={formData.category}
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">Javascript</option>
            <option value="react">React</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>

        <div className="flex gap-4 items-center justify-between border-4  border-purple-400 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />

          <Button
            type="button"
            gradientDuoTone={"purpleToBlue"}
            size="sm"
            outline
            onClick={uploadImage}
            disabled={imageUploadProgress}
          >
            Upload Image
          </Button>
        </div>
        {imageUploadError && (
          <Alert color={"failure"}>{imageUploadError}</Alert>
        )}
        {formData.image !== '' && (
          <img
            // src={ 'https://contenthub-static.grammarly.com/blog/wp-content/uploads/2017/11/how-to-write-a-blog-post.jpeg'}
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}

        {imageUploadProgress && (
          <Progress
            progress={imageUploadProgress}
            color="purple"
            size="lg"
            labelProgress
          />
        )}
        <ReactQuill
          theme="snow"
          onChange={handleChange}
          required
          className="h-72 pb-12"
          value={formData.content}
        />

        <Button type="submit" gradientDuoTone={"purpleToPink"} className="mt-5">
          Update
        </Button>
        {publishError && <Alert color={"failure"}>{publishError}</Alert>}
      </form>
    </div>
  );
};

export default UpdatePost;
