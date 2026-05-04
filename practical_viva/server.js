
import express from "express";
import fs from "fs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "secret123";

// -------- FILE PATHS --------
const USERS = "./users.json";
const POSTS = "./posts.json";
const COMMENTS = "./comments.json";

// -------- INIT FILES --------
[USERS, POSTS, COMMENTS].forEach(path => {
  if (!fs.existsSync(path)) fs.writeFileSync(path, "[]");
});

// -------- HELPERS --------
const readData = (path) => {
  return JSON.parse(fs.readFileSync(path, "utf-8") || "[]");
};

const writeData = (path, data) => {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
};

// -------- MIDDLEWARE --------
const verifyToken = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) return res.status(401).json({ msg: "No token provided" });

  token = token.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
};

// -------- AUTH --------

// Register
app.post("/api/register", async (req, res) => {
  const users = readData(USERS);
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ msg: "All fields required" });

  if (users.find(u => u.email === email))
    return res.status(400).json({ msg: "User already exists" });

  const hash = await bcrypt.hash(password, 10);

  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    passwordHash: hash,
    role: "user",
    createdAt: new Date()
  };

  users.push(newUser);
  writeData(USERS, users);

  res.json({ msg: "User registered successfully" });
});

// Login
app.post("/api/login", async (req, res) => {
  const users = readData(USERS);
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ msg: "User not found" });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(400).json({ msg: "Wrong password" });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
});

// -------- POSTS --------

// Create Post
app.post("/api/posts", verifyToken, (req, res) => {
  const posts = readData(POSTS);

  const newPost = {
    id: Date.now().toString(),
    userId: req.user.id,
    title: req.body.title,
    content: req.body.content,
    tags: req.body.tags || [],
    createdAt: new Date()
  };

  posts.push(newPost);
  writeData(POSTS, posts);

  res.json(newPost);
});

// Update Post
app.put("/api/posts/:id", verifyToken, (req, res) => {
  const posts = readData(POSTS);
  const post = posts.find(p => p.id === req.params.id);

  if (!post) return res.status(404).json({ msg: "Post not found" });

  if (post.userId !== req.user.id)
    return res.status(403).json({ msg: "Unauthorized" });

  post.title = req.body.title || post.title;
  post.content = req.body.content || post.content;

  writeData(POSTS, posts);

  res.json(post);
});

// Delete Post
app.delete("/api/posts/:id", verifyToken, (req, res) => {
  let posts = readData(POSTS);
  const post = posts.find(p => p.id === req.params.id);

  if (!post) return res.status(404).json({ msg: "Post not found" });

  if (post.userId !== req.user.id)
    return res.status(403).json({ msg: "Unauthorized" });

  posts = posts.filter(p => p.id !== req.params.id);
  writeData(POSTS, posts);

  res.json({ msg: "Post deleted" });
});

// -------- COMMENTS --------

// Add Comment
app.post("/api/posts/:postId/comment", verifyToken, (req, res) => {
  const comments = readData(COMMENTS);

  const newComment = {
    id: Date.now().toString(),
    postId: req.params.postId,
    userId: req.user.id,
    comment: req.body.comment,
    createdAt: new Date()
  };

  comments.push(newComment);
  writeData(COMMENTS, comments);

  res.json(newComment);
});

// -------- GET POSTS WITH COMMENTS --------

app.get("/api/posts", (req, res) => {
  const posts = readData(POSTS);
  const comments = readData(COMMENTS);

  const result = posts.map(post => ({
    ...post,
    comments: comments.filter(c => c.postId === post.id)
  }));

  res.json(result);
});

// -------- START SERVER --------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
