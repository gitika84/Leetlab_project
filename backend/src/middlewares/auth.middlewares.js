import { asyncHandler } from "../utils/async-handler.js"
import jwt from "jsonwebtoken"
import { db } from "../libs/db.js"
import { ApiError } from "../utils/api-errors.js"

export const authMiddleware = asyncHandler(async (req , res , next) => {
    const token = req.cookies.jwt

    if(!token){
        return res.status(401).json(
            new ApiError(401 , "Token Invalid")
        )
    }

    let decoded = await jwt.verify(token , process.env.JWT_SECRET)

    const user = await db.user.findUnique({
        where : { id : decoded.id },
        select : {
            id : true,
            name : true,
            image : true,
            email : true,
            role : true
        }
    })

    if(!user){
        return res.status(404).json(
            new ApiError(404 , "User not found")
        )
    }

    req.user = user
    next()

})