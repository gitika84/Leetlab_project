import express from "express"
import { registerUser, loginUser, logoutUser, check } from "../controllers/auth.controllers.js"

const router = express.Router()

router.post("/register" , registerUser)
router.get("/login" , loginUser)
router.get("/logout" , logoutUser)
router.get("/check" , check)

export default router