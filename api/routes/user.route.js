import { Router } from "express";
import { deleteUser, getUser, getUsers, signout, updateUser } from "../controllers/user.controllers.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = Router()

router.put('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)
router.post('/signout', signout)
router.get('/get-users', verifyToken, getUsers)
router.get('/:userId', getUser)

export default router  