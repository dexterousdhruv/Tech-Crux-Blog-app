import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";


export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token

  if(!token) return next(errorHandler(402, 'Unauthorized, token not found!'))

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(errorHandler(402, 'Unauthorized'))
    }

    req.userId = decoded.id
    req.isAdmin = decoded.isAdmin
    next()
  })
}
