import user from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return next(errorHandler(400, "All fields are reqired"));
  }

  const hashPassword = bcryptjs.hashSync(password, 10);
  const newUser = new user({
    username,
    email,
    password: hashPassword,
  });
  try {
    await newUser.save();
    res.send("user created successfully");
  } catch (error) {
    next(error);
  }
};
