import auth from "../utils/auth.js";
import  userModel from "../model/user.js";
import crypto from "crypto";
import nodemailer from "nodemailer"
import markdown from "../model/markdownschema.js";


const signup = async (req,res)=>{
    try {
        const user = await userModel.findOne({email:req.body.email})

        if (!user) {
            req.body.password = await auth.hashPassword(req.body.password)

            await userModel.create(req.body)

            res.status(200).send({
                message:"user created successfuly"
            })

        } else {
            res.status(402).send({
                message:"user already exist"
            })
        }
    } catch (error) {
        res.status(500).send({
            message:error.message||"internal error"
        })
    }
}

const login = async (req,res)=>{
    try {
        const user = await userModel.findOne({email:req.body.email})
        if (user) {
            if(await auth.hashCompare(req.body.password, user.password)){
                let token = await auth.createToken({
                    name:user.name,
                    email:user.email,
                    id:user._id,
                    role:user.role
                })
                res.status(200).send({
                    message:"login successful",
                    name:user.name,
                    email:user.email,
                    id:user._id,
                    token
                })
            }
            else{
                res.status(400).send({
                    message:"password wrong"
                })
            }
            
        } else {
            res.status(400).send({
                message:"user not found"
            })
        }
        
    } catch (error) {
        res.status(500).send({
            message:error.message||"internal server error"
        })
    }
}

const forgetPassword = async (req,res) =>{
    try {
        const user = await userModel.findOne({email:req.body.email})

        if (!user) {
            res.status(402).send({
                message:"user not found, please enter valid email"
            })
        }
        const resetToken = crypto.randomBytes(15).toString('hex')
        user.resetToken = resetToken
        user.resetTokenExpriration = Date.now()+3600000
        await user.save()

        const transporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
            user: "gokulmuruganp@gmail.com",
            pass: "peup grbt juyr fxkj"
            }
        })

        const mailOption = {
            from: "gokulmuruganp@gmail.com",
            to: user.email,
            subject: 'Password Reset',
            text:`http://localhost:5173/resetpassword/${resetToken}`
        }
            transporter.sendMail(mailOption,(error, info)=>{
                if(error){
                    console.log(error)
                    res.status(500).json({error:"Error sending email"})
                }else{
                    console.log("Email sent: " + info.response);
                    res.json({
                        message:"reset link sent to your email"
                    })
                }
            })
        
    } catch (error) {
        res.status(500).send({
            message:error.message||"internal server error"
        })
    }
}

const resetPassword = async (req,res)=>{
    try {
        let token = req.body.token

        if(token){
            let user = await userModel.findOne({
                resetToken:req.body.token
            })
            if (user) {
                user.password = await auth.hashPassword(req.body.password)
                await user.save()
                res.status(200).send({ 
                    message:"user password reset successfully"
                })
            } else {
                res.status(400).send({
                    message:"user not found"
                })
            }
        }
        else{
            res.status(400).send({
                message:"token not found"
            })
        }
    } catch (error) {
        res.status(500).send({
            message:error.message||"internal server error"
        })
    }
}

const createMarkdown = async (req, res)=>{
    try {
        const content = req.body;
        const newMarkdown = new markdown(content);
        await newMarkdown.save();
        res.status(201).send(newMarkdown);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error' });
      }
}

const markdownList = async(req, res)=>{
    try {
        const markdownAll = await markdown.find({})
        res.status(201).send(markdownAll)
    } catch (error) {
        res.status(500).send({
            message:"server error"
        })
    }
}

const markdownFindById = async (req,res)=>{
    try {
        const markdownById = await markdown.findOne({_id:req.params.id})
        if(!markdown){
         res.status(404).send({
        message:"markdown not found"
        })
    }
            res.send(markdownById)

    } catch (error) {
        res.status(500).send({
            message:"server error"
        })
    }
}

const updateMarkdown = async (req,res)=>{
    try {
        const {content} = req.body
        if(!content) {
            res.status(404).send({
                message:"content required"
            })
        }
        const updateList = await markdown.findByIdAndUpdate(
            req.params.id,
            {content},
            {new:true}
        )
        if (!updateList) {
            return res.status(404).send({ message: 'Markdown document not found' });
          }
      
          res.send(updateList);
    } catch (error) {
        res.status(500).send({
            message:error.message||"server error"
        })
    }
}

const deleteMarkdown = async (req,res)=>{
    try {
        const deletedMarkdown = await markdown.findByIdAndDelete(req.params.id);
    if (!deletedMarkdown) {
      return res.status(404).send({ message: 'Markdown document not found' });
    }
    res.send({ message: 'Markdown document deleted' });
    } catch (error) {
        res.status(500).send({
            message:error.message||"server error"
        })
    }
}

const countAll = async (req,res)=>{

   try {
    const totalCount = await markdown.countDocuments()
    const totalUsers = await userModel.countDocuments()
    res.json({totalCount,totalUsers})
   } catch (error) {
    res.status(500).send({
        message:"internal error"
    })
   }
  };

export default{
    login,
    signup,
    forgetPassword,
    resetPassword,
    createMarkdown,
    countAll,
    markdownFindById,
    updateMarkdown,
    deleteMarkdown,
    markdownList
}