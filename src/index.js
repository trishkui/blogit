import express from "express";
import cors from "cors";
import { registerUser } from "./controllers/users.js";
import cookieParser from "cookie-parser";
import { loginUser } from "./controllers/auth.js";
import validateUserInformation from "./middleware/validateUserInformation.js";
import { createBlog } from "./controllers/blogs.js";
import verifyToken from "./middleware/verifyToken.js";
import validateBlog from "./middleware/validateBlog.js";

const app = express();

// Register middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(cookieParser());

// Routes
app.post("/users", validateUserInformation, registerUser);
app.post("/auth/login", loginUser);
app.post("/blogs", verifyToken, validateBlog, createBlog); // Apply verifyToken middleware here

// Server
app.listen(4000, () => console.log("Server running on port 4000..."));
