import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import Approutes from "./src/routes/index.js"
dotenv.config()
let app = express()
app.use(cors())
app.use(express.json())
app.use(Approutes)
app.listen(process.env.PORT, ()=>console.log("app is running in " + process.env.PORT))