import { StatusCodes } from "http-status-pro-js";
import User from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";


async function checkEmail(email){

    try{
        // abstract api for check krne k liye!!
        let url = `https://emailreputation.abstractapi.com/v1/?api_key=0de64f47eb034c90895e4ad4f627f7cb&email=${email}`; 

        let response = await fetch(url);

        let data = await response.json();
        

       if(data.email_deliverability.status === "deliverable"){
    return true;
}else{
    return false;
}

    }catch(err){
        console.log("email check ",err);
        return false;
    }
}




export async function createUser(req,res){
        
    let {name,email,password,role} = req.body;
   

    try{

        let valid = await checkEmail(email);

        if(!valid){
            return res.status(StatusCodes.BAD_REQUEST.code).json({
                code:StatusCodes.BAD_REQUEST.code,
                message:"Invalid Email",
                data:null
            })
        }

        let exist = await User.findOne({email});

        if(exist){
            return res.status(StatusCodes.CONFLICT.code).json({
                code:StatusCodes.CONFLICT.code,
                message:"User already exists",
                data:null
            })
        }

        let pass = bcrypt.hashSync(password,10);
        password = pass;

        let obj = new User({name,email,password,role});

         sendEmail(email,"portfolio", `hii ${email.split("@")[0]}, welcome to my portfolio`);

        await obj.save()
        .then(()=>{
            return res.status(StatusCodes.CREATED.code).json({
                code:StatusCodes.CREATED.code,
                message:StatusCodes.CREATED.message,
                data:null
            })
        })
        .catch((err)=>{
            console.log(err);
        })

    }catch(err){
        console.log("create ",err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR.code).json({
            code:StatusCodes.INTERNAL_SERVER_ERROR.code,
            message:StatusCodes.INTERNAL_SERVER_ERROR.message,
            data:null
        })
    }
}



// login 
export async function userLogin(req,res){
    try{
        const{email, password}=req.body;
        await User.findOne({email:email})
        .then((data)=>{
            if(!data){
                return res.status(StatusCodes.BAD_REQUEST.code).json({
                    code:StatusCodes.BAD_REQUEST.code,
                    message :"user not found",
                    data:null
                });

            }
            // compare passwrod
            const comPass = bcrypt.compareSync(password,data.password);
            if(!comPass){
                return res.status(StatusCodes.BAD_REQUEST.code).json({
                    code:StatusCodes.BAD_REQUEST.code,
                    message:"Invalid password",
                    data:null
                });
            }
            // abb token generate krna hai
            const token =jwt.sign(
                {id:data._id},
                process.env.JWT_SECRET,
                {expiresIn:"7d"}

            );
            return res.status(StatusCodes.OK.code).json({
                code:StatusCodes.OK.code,
                message:StatusCodes.OK.message,
                data:{
                    name:data.name,
                    id:data._id,
                    token:token

                }
            });
        })
        .catch((err)=>{
            console.log(err);
        });

    }catch(err){
        console.log("login error",err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR.code).json({
            code:StatusCodes.INTERNAL_SERVER_ERROR.code,
            message:StatusCodes.INTERNAL_SERVER_ERROR.message,
            data:null
        });
    }
}

// profie get krne k liye
export async function getProfile(req,res){

    try{

        let user = await User.findById(req.user.id);

        if(!user){
            return res.status(StatusCodes.NOT_FOUND.code).json({
                code:StatusCodes.NOT_FOUND.code,
                message:"User not found",
                data:null
            })
        }

        return res.status(StatusCodes.OK.code).json({
            code:StatusCodes.OK.code,
            message:StatusCodes.OK.message,
            data:{
                name:user.name,
                email:user.email,
                role:user.role
            }
        })

    }catch(err){
        console.log("profile ",err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR.code).json({
            code:StatusCodes.INTERNAL_SERVER_ERROR.code,
            message:StatusCodes.INTERNAL_SERVER_ERROR.message,
            data:null
        })
    }
}

// profile edit krne k liye
export async function updateProfile(req,res){

    let {name,email} = req.body;

    try{

        let user = await User.findById(req.user.id);

        if(!user){
            return res.status(StatusCodes.NOT_FOUND.code).json({
                code:StatusCodes.NOT_FOUND.code,
                message:"User not found",
                data:null
            })
        }

        if(email){
            let exist = await User.findOne({email});

            if(exist && exist._id.toString() !== req.user.id){
                return res.status(StatusCodes.CONFLICT.code).json({
                    code:StatusCodes.CONFLICT.code,
                    message:"Email already in use",
                    data:null
                })
            }
        }

        user.name = name || user.name;
        user.email = email || user.email;

        await user.save()
        .then(()=>{
            return res.status(StatusCodes.OK.code).json({
                code:StatusCodes.OK.code,
                message:"Profile updated",
                data:null
            })
        })
        .catch((err)=>{
            console.log(err);
        })

    }catch(err){
        console.log("update ",err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR.code).json({
            code:StatusCodes.INTERNAL_SERVER_ERROR.code,
            message:StatusCodes.INTERNAL_SERVER_ERROR.message,
            data:null
        })
    }
}

//for otp generation
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

//send otp
export async function forgotPassword(req, res) {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const otp = generateOTP();

        // Save OTP (2 min expiry)
        user.resetOtp = otp;
        user.otpExpiry = Date.now() + 2 * 60 * 1000;

        await user.save();

        // Send email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Password Reset OTP",
            html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f6f8;
      padding: 20px;
    }
    .container {
      max-width: 500px;
      background: white;
      padding: 20px;
      margin: auto;
      border-radius: 10px;
      text-align: center;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    .otp {
      font-size: 28px;
      font-weight: bold;
      color: #4facfe;
      letter-spacing: 5px;
      margin: 20px 0;
    }
    .footer {
      font-size: 12px;
      color: gray;
      margin-top: 20px;
    }
  </style>
</head>

<body>
  <div class="container">
    <h2>Email Verification</h2>
    
    <p>Your One-Time Password (OTP) is:</p>
    
    <div class="otp">${otp}</div>
    
    <p>This OTP will expire in <b>2 minutes</b>.</p>
    
    <p>If you didn’t request this, please ignore this email.</p>
    
    <div class="footer">
      Do not share your OTP with anyone.
    </div>
  </div>
</body>
</html>`
        });

        res.json({ message: "OTP sent to email" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error" });
    }
}

//verify otp
export async function verifyOtp(req, res) {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.resetOtp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if (user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: "OTP expired" });
        }

        //Mark OTP verified
        user.isOtpVerified = true;

        await user.save();

        res.json({ message: "OTP verified successfully" });

    } catch (err) {
        res.status(500).json({ message: "Error" });
    }
}

//change password
export async function changePassword(req, res) {

    const { email, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        //Block if OTP not verified
        if (!user.isOtpVerified) {
            return res.status(400).json({
                message: "OTP not verified"
            });
        }

        // Set new password
        user.password = bcrypt.hashSync(newPassword, 10);

        //Reset everything
        user.resetOtp = null;
        user.otpExpiry = null;
        user.isOtpVerified = false;

        await user.save();

        res.json({ message: "Password reset successful" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error" });
    }
}


async function sendEmail(to,subject,text){

    try{

        let transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.EMAIL,
                pass:process.env.EMAIL_PASS
            }
        });

        let info = await transporter.sendMail({
            from:`"Portfolio App" <${process.env.EMAIL}>`,
            to:to,
            subject:subject,
            text:text,
            html:`<p>${text}</p>`
        });

        console.log("Message sent:", info.messageId);

        return true;

    }catch(err){
        console.log("mail error ",err);
        return false;
    }
}