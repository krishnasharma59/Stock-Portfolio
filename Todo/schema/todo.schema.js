import mongoose from "mongoose";

export default function TodoSchema(){
    try {
        let TodoSchema = new mongoose.Schema({
            title:{
                type:String,
                trim:true,
                required:true
            },
            description:{
                type:String,
                trim:true,
                required:true
            },
            status:{
                type:String,
                trim:true,
            },
            user_id:{
                type:mongoose.Schema.ObjectId,
                ref:"user"
            }
        })
        let todo = mongoose.model('todo',TodoSchema)

    } catch (error) {
        console.log(error)
    }
}