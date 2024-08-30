import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs'


export const updateUser = async (req, res, next) => {
  const  { userId, params: {id}, body: { username, email, profilePicture }  } = req
  let { password } = req.body

  if(userId !== id)
    return next(errorHandler(403, 'Unauthorized user update'))

  if (password) {
    if (password.length < 6) 
      return next(errorHandler(400, 'Password must be atleast 6 characters.'))

    else  
      password = bcryptjs.hashSync(password)  
  
  }

  if (username) { 
    if (username.includes(" ")) 
      return next(errorHandler(400, 'Username must not contain empty spaces.'))
      
    if (username.length < 5 || username.length > 20 ) 
      return next(errorHandler(400, 'Username must be between 5 and 20 characters.'))
    
    if(username !== username.toLowerCase())
      return next(errorHandler(400, 'Username must be lowercase.'))
    
    if(!username.match(/^[a-zA-Z0-9]+$/))
      return next(errorHandler(400, 'Username must only contain letters and numbers.'))
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(id, {
      $set: {
        ...(username && { username }),
        ...(password && { password }),
        ...(email && { email }),
        ...(profilePicture && { profilePicture }),
      }
    }, { new: true })

    const { newPass, ...rest } = updatedUser._doc 
    
    res.status(200).json(rest)

  } catch (err) {
    console.log(err)
    next(err)
  }

  
}

export const deleteUser = async (req, res, next) => {
  const { userId, isAdmin, params: { id } } = req

  if(!isAdmin && userId !== id )
    return next(errorHandler(403, 'You are not allowed to delete this user!'))

  try {
    await User.findByIdAndDelete(id)
    res.status(200).json('User has been deleted')

  } catch (err) {
    next(err)
  }

}

export const signout = async (req, res, next) => {
  try {
    res.clearCookie('access_token').status(200).json('User has been signed out')

  } catch (e) {
    next(e)
  }
}

export const getUsers = async (req, res, next) => {
  const { isAdmin } = req

  if(!isAdmin)
    return next(errorHandler(403, 'You are not allowed to see all users!'))
    
  try {
    const startIndex = parseInt(req.query.startIndex) || 0
    const limit = parseInt(req.query.limit) || 9
    const sortDirection = req.query.order === 'asc' ? 1 : -1

    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit)

    const totalUsers = await User.countDocuments()

    const now = new Date()
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())

    const lastMonthUsers = await User.countDocuments({ createdAt: { $gte: oneMonthAgo }})

    res.status(200).json({
      users,
      totalUsers,
      lastMonthUsers
    })

  } catch (e) {
    next(e)
  }
}

export const getUser = async (req, res, next) => {
  const { userId } = req.params

  try {
    const user = await User.findById(userId)

    if(!user)
      return next(errorHandler(404, 'User not found'))

    const { password, ...rest } = user._doc

    res.status(200).json(rest)
 
  } catch (e) {
    next(e)
  }
}