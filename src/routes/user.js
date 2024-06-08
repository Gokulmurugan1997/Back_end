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
router.get("/:id", validate,userController.markdownFindById)
router.post("/createmarkdown", validate,userController.createMarkdown)
router.put("/:id", validate,userController.updateMarkdown)
router.delete("/:id", validate,userController.deleteMarkdown)
router.get("/", validate,userController.countAll)
router.put("/edit/:id", validate,userController.editUserById)

export default router