import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import healthcheckRoutes from "./routes/healthcheck.routes.js"
import userRoutes from "./routes/auth.routes.js"
dotenv.config()

const app = express()

const port = process.env.PORT

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use("/api/v1/health", healthcheckRoutes)
app.use("/api/v1/users" , userRoutes)

app.listen(port , () => {
    console.log(`Server is running on PORT ${port}`)
})



