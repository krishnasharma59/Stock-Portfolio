//dependencies

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import morgan from 'morgan';

//modules

import createBook from './modules/createBook.js';

//connections
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
let port = process.env.PORT || 8001
mongoose.connect("mongodb://127.0.0.1:27017/library").then(()=>{
    console.log("mongo connected");
})

let postSchema = new mongoose.Schema({
    title:String,
    author:String,
    price: Number,
    UserId: {type:mongoose.Schema.ObjectId,ref: 'User'}
})
const User = mongoose.model('book',postSchema);
export default User;
app.post('/create', createBook);
//testing
app.listen(port,()=>{
    console.log("Server Connected");
})