import express from "express"
import userController from "../controller/user.js"
import validate from "../middleware/validate.js"
import Adminguard from "../middleware/AdminGaurd.js"
const router = express.Router()

router.post("/signup", userController.signup)
router.post("/login", userController.login)
router.post("/forgetpassword", userController.forgetPassword)
router.post("/resetpassword", userController.resetPassword)
router.get("/getMarkdownlist",validate, userController.markdownList)
router.get("/:id", userController.markdownFindById)
router.post("/createmarkdown", userController.createMarkdown)
router.put("/:id", userController.updateMarkdown)
router.delete("/:id", userController.deleteMarkdown)
router.get("/", validate,userController.countAll)
router.put("/edit/:id", userController.editUserById)

export default router