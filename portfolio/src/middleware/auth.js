import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-pro-js";

export function verifyToken(req,res,next){

    try{

        let token = req.headers.authorization;

        if(!token){
            return res.status(StatusCodes.UNAUTHORIZED.code).json({
                code: StatusCodes.UNAUTHORIZED.code,
                message: "No token provided",
                data: null
            });
        }

        token = token.split(" ")[1]; // Bearer token

        let decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();

    }catch(err){
        console.log("token error", err);

        return res.status(StatusCodes.UNAUTHORIZED.code).json({
            code: StatusCodes.UNAUTHORIZED.code,
            message: "Invalid token",
            data: null
        });
    }
}