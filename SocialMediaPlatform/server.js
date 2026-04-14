// dependencies
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import morgan from 'morgan';
import fs from 'fs';
import cookieParser from 'cookie-parser';

//files
import login from "./modules/login.js";
import signUp from "./modules/signUp.js";
import auth from "./modules/auth.js";
import postAdd from './modules/addPost.js';
import likePost from "./modules/likes.js";
import logout from "./modules/logout.js";
import addComment from "./modules/commentPost.js";
import deleteComment from "./modules/deleteComment.js";
import deletePost from "./modules/deletePost.js";
import auth2 from "./modules/auth2.js";
import connectDB from "./modules/connectDB.js";
import Post from "./modules/post.js"; 
//running dependencies
dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  helmet({
    contentSecurityPolicy: false
  })
);
app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.static("public"));
let port = process.env.PORT || 8001
//testing

app.get("/dashboard", auth2,async (req, res) => {
    const user = req.user;
    const posts = await Post.find().populate("userId");
    res.render("dashboard", { user, posts, currentUrl: req.originalUrl });
});
app.get("/home", auth2, async (req, res) => {
    const user = req.user;
    const posts = await Post.find().populate("userId");

    res.render("frontPage", { user, posts, currentUrl: req.originalUrl });
});
app.get("/",(req,res)=>{
    res.render("login");
})
app.get("/signUp",(req,res)=>{
    res.render("signUp");
})

app.post("/",login);
app.post("/signup",signUp);
app.post("/addPost",auth2,postAdd);
app.post("/likes/:id",auth2,likePost);
app.get("/logout", logout);
app.post("/comment/:postId",auth2,addComment);
app.post("/comment/delete/:postId/:commentId",auth2,deleteComment);
app.post("/deletePost/:id", auth2, deletePost);
//checking connection

app.listen(port, ()=>{
    console.log("Server Connected on the port");
})
