import user from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are reqired" });
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
    res.status(400).json({ message: error.message });
  }
};
