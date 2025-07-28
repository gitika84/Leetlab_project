import {asyncHandler} from "../utils/async-handler.js"

const healthcheckController = asyncHandler(async (req, res) => {
  res.status(200).json({ status: "ok" })
})

export default healthcheckController