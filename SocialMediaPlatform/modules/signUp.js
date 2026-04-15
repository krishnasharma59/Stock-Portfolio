import User from "./user.js";
import bcrypt from "bcrypt";

async function createUser(req, res) {
  try {
    const { name, username, email, password } = req.body;

    // ✅ Required fields
    if (!name || !username || !email || !password) {
      return res.render("signUp", { error: "All fields are required" });
    }

    if (password.length > 14) {
      return res.render("signUp", {
        error: "Password must be 14 characters or less"
      });
    }

    // ✅ Check email
    const isEmail = await User.findOne({ email });
    if (isEmail) {
      return res.render("signUp", { error: "Email already exists" });
    }

    // ✅ Check username
    const isUsername = await User.findOne({ username });
    if (isUsername) {
      return res.render("signUp", { error: "Username already taken" });
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
    console.error("signUp ERROR:", error);

    // 🔥 VERY IMPORTANT (duplicate index error)
    if (error.code === 11000) {
      if (error.keyPattern?.email) {
        return res.render("signUp", { error: "Email already exists" });
      }
      if (error.keyPattern?.username) {
        return res.render("signUp", { error: "Username already taken" });
      }
      return res.render("signUp", { error: "Duplicate data" });
    }

    return res.render("signUp", {
      error: "Something went wrong"
    });
  }
}

export default createUser;