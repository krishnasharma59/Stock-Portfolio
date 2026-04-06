import joi from "joi"
import {StatusCodes} from "http-status-pro-js"
export default function userSignupMidware(req,res,next){
    try {
        let user = joi.object({
            name:joi.string().trim().lowercase().min(3).max(100).required(),
            email:joi.string().email().pattern(/@gmail\.com$/).trim().required(),
            password:joi.string().alphanum().min(4).max(8).required()
        })
    
        let{error,value} = user.validate(req.body)
        if(error){
            return res.status(StatusCodes.BAD_REQUEST.code).json({
                code:StatusCodes.BAD_REQUEST.code,
                message:StatusCodes.BAD_REQUEST.message
            })
        }
    
        req.body = value
        next()
    } catch (error) {
        console.log(error)
    }
}