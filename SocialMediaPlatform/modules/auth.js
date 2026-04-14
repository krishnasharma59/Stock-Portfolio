import {StatusCodes} from "http-status-pro-js"
import dotenv from "dotenv";
import jwt from "jsonwebtoken"
dotenv.config()
function auth(req, res, next){
    try {
        console.log(req.body);
        let authorization = req?.headers?.authorization
        if(!authorization || !authorization.startsWith("Bearer ")){
            console.log(authorization);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR.code).json({
                code:StatusCodes.INTERNAL_SERVER_ERROR.code,
                message:StatusCodes.INTERNAL_SERVER_ERROR.message,
                data:null
            }) 
            return;
        }
        console

        let auth = authorization.split(" ")[1]
        let token = jwt.verify(auth, process.env.TOKENKEY)
        req.user = token.id;
        console.log(req.user);
        //req.body.userId = token.id;
        //console.log(token.id);
        next()
       
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.UNAUTHORIZED.code).json({
            code:StatusCodes.UNAUTHORIZED.code,
            message:error.message,
            data:null
        })
       
    }

}
export default auth