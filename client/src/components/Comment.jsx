import { useEffect, useState } from "react"
import { editComment, getUserWithId } from "../services/Api"
import moment from "moment"
import { FaThumbsUp } from "react-icons/fa"
import { useSelector } from "react-redux"
import { Button, Textarea } from "flowbite-react"

const placeholderImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1mR6HLZ_qurbUpkxxpzC8fqSpMrVmb8GGaqGrlqRqN-AX8rRokDXPxUvqOWTz6rk7y-g&usqp=CAU'

const Comment = ({ comment, onLike, onEdit, onDelete }) => {
  const [user, setUser] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState('')
  const { currentUser } = useSelector(state => state.user)
  const likeButtonColor = currentUser && comment.likes.includes(currentUser._id) ? 'text-blue-500': 'text-gray-400'

  useEffect(() => { 
    const getUser = async () => {
      try {
        const res =  await getUserWithId(comment.userId)

        if (res.status === 200) {
          setUser(res.data)
        }
      } catch (e) {
        console.log(e)
      }
    }

    getUser()
  }, [comment])
  
  const handleEdit =  () => { 
    setIsEditing(true)
    setEditedContent(comment.content)
  }

  const handleSave = async () => {
    try {
      const res =  await editComment({ content: editedContent })

      if (res.status === 200) {
        onEdit(comment, editedContent)
        setIsEditing(false)
      }

    } catch (e) {
      console.log(e)
    }
  }
  
  return (
    <div className=" flex p-4 border-b dark:border-gray-600">
      <div className="flex-shrink-0 mr-3">
        <img
          src={user.profilePicture || placeholderImage }
          alt={user.username} 
          className="w-10 h-10 rounded-full object-cover bg-gray-200"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user ? ` @${user.username}` : 'anonymous user'}
          </span>
          <span className="text-gray-500 text-xs">{moment(comment.createdAt).fromNow()}</span>
        </div>

        {isEditing ?
          (
            <>
              <Textarea
                className="mb-2 resize-none"
                value={editedContent}
                onChange={e => setEditedContent(e.target.value)}
              />
              <div className=" flex justify-end gap-2">
                <Button
                  type="button"
                  size={'sm'}
                  gradientDuoTone={'purpleToBlue'}
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button
                  type="button"
                  size={'sm'}
                  gradientDuoTone={'purpleToBlue'}
                  outline
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-500 text-sm pb-2">{ comment.content }</p>
              <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
                <button type="button" onClick={() => onLike(comment._id)} className={likeButtonColor}>
                  <FaThumbsUp className="text-sm" />
                </button>
                <p className="text-xs font-light">
                  {comment.numberOfLikes > 0 && `${comment.numberOfLikes} ${comment.numberOfLikes === 1 ? 'like' : 'likes'}`}
                </p>
                {
                  currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                    <>
                      <button
                        type="button"
                        onClick={handleEdit}
                        className="text-gray-400"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(comment._id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        Delete
                      </button>
                    </>
                  )
                }
              </div>
            </>
          )}


      </div>
    </div>
  )
}

export default Comment