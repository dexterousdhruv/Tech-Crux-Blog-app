import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const signup = async (req, res, next) => {
  const userData = req.body

  const { username, password, email } = userData

  // Check for empty fields
  if (!username || !password || !email || !username.length || !email.length || !password.length)
    next(errorHandler(403, 'All fields are required!'))


  try {
    // Check for user with existing username
    const existingUser = await User.findOne({ username })
    const existingEmail = await User.findOne({ email })

    if (existingUser) return next(errorHandler(400, 'Username already taken!')) 
    if (existingEmail) return next(errorHandler(400, 'Email address already taken!')) 
    
    // Hash the password
    const hashedPasssword = bcryptjs.hashSync(password, 10)

    await User({...userData, password: hashedPasssword }).save()
    return res.status(201).send('Signup successful') 


  } catch (err) {
    next(err) 
  } 
}    

export const signin = async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password || !email.length || !password.length)
    next(errorHandler(403, 'All fields are required!'))

  try {
    const validUser = await User.findOne({ email })
    
    if (!validUser) return next(errorHandler(404, 'Invalid email!'))

    const validPassword = bcryptjs.compareSync(password, validUser.password)
    if (!validPassword) return next(errorHandler(404, 'Incorrect password!'))

    const { password: pass, ...rest } = validUser._doc
    
    const token = jwt.sign({ id: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET)

    res.status(200)
      .cookie('access_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 24 * 60 * 60 * 1000
      })
      .json(rest)
 

  } catch (err) {
    next(err)
  } 

 
}    

export const google = async (req, res, next) => {
  const { displayName: name, email, photoURL } = req.body

  
  try {
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      const token = jwt.sign({ id: existingUser._id, isAdmin: existingUser.isAdmin }, process.env.JWT_SECRET)
      const { password, ...rest } = existingUser._doc

      return res.status(200)
        .cookie('access_token', token,
          {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000
          }
        )
        .json(rest)
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8) 
      const hashedPasssword = bcryptjs.hashSync(generatedPassword, 10)
      const newUser = await User({
        username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
        email,
        password: hashedPasssword,
        profilePicture: photoURL,
       }).save()
      
      const { password, ...rest } = newUser._doc
    
      const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET) 
   
      return res.status(200)
        .cookie('access_token', token,
          {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000
          }
        )
        .json(rest)
    
    }

  } catch (e) {
    next(e)
  }
}