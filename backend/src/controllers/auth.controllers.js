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
    const { email , password } = req.body

    const user = await db.user.findUnique({
        where : { email }
    })

    if(!user){
        return res.status(400).json(
            new ApiError(400, "User does not exist")
        )
    }

    const isMatched = await bcrypt.compare(password , user.password)

    if (!isMatched) {
        return res.status(400).json(
            new ApiError(400, "Invalid credentials")
    )
    }

    const token = jwt.sign({ id: user.id},
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
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            image : user.image,
        },"User login Successfully")
    )

})

const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",     
        sameSite: "strict"
    })

    res.status(200).json(
        new ApiResponse(200 , {} , "User logout Successfully")
    )
})

const check = asyncHandler(async (req, res) => {
    res.status(200).json(
        new ApiResponse(200 , {user : req.user} , "User Authenticated Successfully")
    )
})

export { registerUser , loginUser , logoutUser , check }