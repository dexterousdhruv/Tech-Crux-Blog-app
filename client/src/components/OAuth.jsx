import { Button } from "flowbite-react"
import { AiFillGoogleCircle } from 'react-icons/ai'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { app } from "../firebase"
import { useDispatch } from "react-redux"
import { signInFailure, signInSuccess } from "../redux/user/userSlice"
import { useNavigate } from "react-router-dom"
import { googleSignin } from "../services/Api"

const OAuth = () => {
  const auth = getAuth(app)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })

    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider)
      const { displayName, email, photoURL } = resultsFromGoogle.user

      const data = {displayName, email, photoURL }

      const res = await googleSignin(data)
    
      if (res.status === 200) {
        dispatch(signInSuccess(res.data))
        navigate("/")
      }

    } catch (e) {
      const { status, statusText, data } = e.response
      const message = (status === 500) ? statusText : data.message

      dispatch(signInFailure(message))
    }

  }

  return (
    <Button
      type="button"
      gradientDuoTone={"pinkToOrange"}
      outline
      onClick={handleGoogleClick}
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      Continue with Google
    </Button>
  )
}

export default OAuth