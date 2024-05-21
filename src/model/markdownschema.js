import mongoose from "./index.js"

const markdownSchema = new mongoose.Schema({
    content:{
        type:String
    } ,
    timestamp:{
        type:Date,
        default: Date.now
    },
},{
    collection:"markdown",
    versionKey:false
})

const markdown = mongoose.model("markdown", markdownSchema)

export default markdown