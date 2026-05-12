import express from "express";
import { createUser,userLogin,changePassword,updateProfile,getProfile,forgotPassword,verifyOtp } from "../controller/user_controller.js";
import { addstock,updateStockQuantity,deleteStock, sellStock,getTransactionHistory } from "../controller/stock.js";
import { verifyToken } from "../middleware/auth.js";
import nodemailer from "nodemailer";

const router = express.Router();

//user route
router.post("/signup",createUser);
router.post("/login",userLogin);


router.post("/addstock",addstock);
router.post("/updateStockQuantity",updateStockQuantity);
router.post("/deleteStock",deleteStock);
router.post("/sellStock",sellStock);

router.post("/forgotpassword", forgotPassword);
router.post("/verifyotp", verifyOtp);
router.post("/changepassword", changePassword);


// user profile handel
router.get("/getprofile",verifyToken,getProfile);
router.put("/update",verifyToken,updateProfile);

router.get("/transactions", getTransactionHistory);

export default router;