import user from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs"
export const userRoutes = (req, res) => {
  res.send("route working successfully");
};


export const updateRoute = async (req,res,next)=>{
  if(req.user.id !== req.params.userId){
    return next(errorHandler(403,"You are not allowed to update this user"))
  }

  if (req.body.password) {
    if(req.body.password.length < 6){
      return next(400,"password must be at least 6 characters")
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10)
  }

  if (req.body.username) {
    if(req.body.username.length < 6 || req.body.username.length>20){
      return next(400,"username must be between 6 and 20 characters")
    }
    if(req.body.username && !req.body.username.match(/^[a-zA-Z0-9]+$/)){
      return next(errorHandler(400,"Username can only contain letters and numbers"))
    }
  }

  try{

    const updateUser = await user.findByIdAndUpdate(req.params.userId,{
      $set:{
        username:req.body.username,
        email:req.body.email,
        password:req.body.password,
        profilePicture:req.body.profilePicture,
      }
    }, { new: true })
    const { password, ...rest } = updateUser._doc;
    
    res.status(201).json(rest)

  }catch(err){
next(err)
  }

}