import { asyncHandler } from "../utils/async-handler.js"
import { db } from "../libs/db.js"
import { UserRole } from "../generated/prisma/index.js"
import jwt from "jsonwebtoken"
import { ApiError } from "../utils/api-errors.js"
import { ApiResponse } from "../utils/api-response.js"
import bcrypt from "bcryptjs"

const registerUser = asyncHandler(async (req, res) => {
    const { name , email , password } = req.body
    console.log(name)

    const existingUser = await db.user.findUnique({
        where : { email }
    })

    if(existingUser){
        return res.status(400).json(
            new ApiError(400 , "User already exists")
        )
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    console.log(hashedPassword)

    const newUser = await db.user.create({
        data: {
            name,
            email,
            password : hashedPassword,
            role: UserRole.USER,
            image : ""
        }
    })
    console.log(newUser)

    if(!newUser){
        return res.status(400).json(
            new ApiError(400 , "User not created")
        )
    }

    const token = jwt.sign({ id: newUser.id},
        process.env.JWT_SECRET,
        { expiresIn : "7d"}
    )

    res.cookie("jwt" , token , {
        httpOnly : true,
        sameSite : "strict",
        secure : process.env.NODE_ENV !== "development",
        maxAge : 1000 * 60 * 60 * 24 * 7 // 7 days
    })

    res.status(201).json(
        new ApiResponse(201 , { 
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            image : newUser.image,
        },"User Registered Successfully")
    )

})

const loginUser = asyncHandler(async (req, res) => {

})

const logoutUser = asyncHandler(async (req, res) => {

})

const check = asyncHandler(async (req, res) => {

})

export { registerUser , loginUser , logoutUser , check }