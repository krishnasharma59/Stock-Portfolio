import mongoose from "mongoose";

export default function userSchema(){
    try {
        let userSchema = new mongoose.Schema({
            name:{
                type:String,
                trim:true,
                max: 100,
                min: 3,
                required:true
            },
            email:{
                type:String,
                trim:true,
                unique:[true, 'email already exists'],
                validate:{
                    validator: function(value){
                        return /@gmail\.com$/.test(value)
                    }
                },
                required:true
            },
            password:{
                type:String,
                trim:true,
                min:[4 ,'minimun length should be 4'],
                max:[8, 'maximum length should be 8'],
                validate:{
                    validator: function(value){
                        return /[a-zA-Z0-9]/.test(value)
                    }
                }
            }
        })
        
        let user = mongoose.model("user",userSchema)
    } catch (error) {
        console.log(error)
    }
}

