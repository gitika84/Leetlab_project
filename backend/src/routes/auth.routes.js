import express from "express"
import { registerUser, loginUser, logoutUser, check } from "../controllers/auth.controllers.js"
import { authMiddleware } from "../middlewares/auth.middlewares.js"

const router = express.Router()

router.post("/register" , registerUser)
router.post("/login", loginUser)
router.get("/logout", authMiddleware, logoutUser)
router.get("/check", authMiddleware , check)

export default router