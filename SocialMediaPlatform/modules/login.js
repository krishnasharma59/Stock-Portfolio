import User from "./user.js";
import { StatusCodes } from "http-status-pro-js";
import bcrypt from "bcrypt";
import logger from "../logger/logger.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

async function login(req, res) {
  try { 
    let { email, password } = req.body;
    if (!email || !password) {
      return res.render("login", {
        error: "Email and password are required",
        email
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.render("login", {
        error: "Email or password is wrong",
        email
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("login", {
        error: "Email or password is wrong",
        email
      });
    }
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username
      },
      process.env.TOKENKEY,
      { expiresIn: "1h" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None"
    });

    res.redirect("/dashboard");

  } catch (error) {
    console.log(error.message);

    logger("error", StatusCodes.INTERNAL_SERVER_ERROR.message);

    return res.render("login", {
      error: "Something went wrong, try again later"
    });
  }
}

export default login;