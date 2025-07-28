import express from "express"
import healthcheckController from "../controllers/healthcheck.controllers.js"

const router = express.Router()

router.get("/healthcheck", healthcheckController)

export default router