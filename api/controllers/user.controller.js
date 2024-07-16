import user from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs"
export const userRoutes = (req, res) => {
  res.send("route working successfully");
};


export const updateRoute = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this user"))
  }

  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(400, "password must be at least 6 characters")
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10)
  }

  if (req.body.username) {
    if (req.body.username.length < 6 || req.body.username.length > 20) {
      return next(400, "username must be between 6 and 20 characters")
    }
    if (req.body.username && !req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(errorHandler(400, "Username can only contain letters and numbers"))
    }
  }

  try {

    const updateUser = await user.findByIdAndUpdate(req.params.userId, {
      $set: {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        profilePicture: req.body.profilePicture,
      }
    }, { new: true })
    const { password, ...rest } = updateUser._doc;

    res.status(201).json(rest)

  } catch (err) {
    next(err)
  }

}

export const deleteRoute = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(400, "You are not allowed to delete this user"))
  }

  try {
    await user.findByIdAndDelete(req.params.userId);
    res.status(200).json("user has been deleted")

  } catch (error) {
    next(error)
  }
}

export const signoutRoute = (req, res, next) => {
  try {
    res.clearCookie("access_token").status(200).json("user has been signed out");
  } catch (error) {
    next(error)
  }
}

export const getUsers = async(req, res, next) => {
 
    if(!req.user.isAdmin){
      return next(errorHandler(403,"You are not allowed to see all users"))
    }
    try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const users = await user.find()
    .sort({createdAt: sortDirection})
    .skip(startIndex)
    .limit(limit);

    const userWithoutPassword =  users.map((user)=>{
      const { password, ...rest} = user._doc;
      return rest;
    });

    const totalUsers = await user.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    )

    const lastMonthUsers = await user.countDocuments({
      createdAt:{$gte: oneMonthAgo}
  })

    res.status(200).json({
      users: userWithoutPassword,
      totalUsers,
      lastMonthUsers
    })
    
  } catch (error) {
    next(error)
  }
}