import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import signup from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
dotenv.config();
mongoose
	.connect(process.env.URI)
	.then(() => console.log("mongoDB connected"))
	.catch((err) => console.log(err));

app.listen(process.env.PORT, () => {
	console.log("app running successfully");
});

const __dirname = path.resolve();

app.use("/api/user", userRoutes);
app.use("/api/auth", signup);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	const message = err.message || "Internal Server Error";
	res.status(statusCode).json({
		success: false,
		statusCode,
		message,
	});
});
