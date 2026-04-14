import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

function auth2(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const decoded = jwt.verify(token, process.env.TOKENKEY);

    // ✅ ONLY THIS (NO user variable anywhere)
    req.user = decoded;

    next();

  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Invalid token"
    });
  }
}

export default auth2;