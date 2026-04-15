import User from "./user.js";
import bcrypt from "bcrypt";

async function createUser(req, res) {
  try {
    const { name, username, email, password } = req.body;

    // ✅ Required fields
    if (!name || !username || !email || !password) {
      return res.render("signup", { error: "All fields are required" });
    }

    if (password.length > 14) {
      return res.render("signup", {
        error: "Password must be 14 characters or less"
      });
    }

    // ✅ Check email
    const isEmail = await User.findOne({ email });
    if (isEmail) {
      return res.render("signup", { error: "Email already exists" });
    }

    // ✅ Check username
    const isUsername = await User.findOne({ username });
    if (isUsername) {
      return res.render("signup", { error: "Username already taken" });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Save user
    await User.create({
      name,
      email,
      username,
      password: hashedPassword
    });

    return res.redirect("/");

  } catch (error) {
    console.error("SIGNUP ERROR:", error);

    // 🔥 VERY IMPORTANT (duplicate index error)
    if (error.code === 11000) {
      if (error.keyPattern?.email) {
        return res.render("signup", { error: "Email already exists" });
      }
      if (error.keyPattern?.username) {
        return res.render("signup", { error: "Username already taken" });
      }
      return res.render("signup", { error: "Duplicate data" });
    }

    return res.render("signup", {
      error: "Something went wrong"
    });
  }
}

export default createUser;