import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./src/routes/route.js";


dotenv.config();

const app = express();

app.set("view engine", "ejs");

app.get("/login", (req, res) => {
  res.render("login", { error: null });
});
app.get("/", (req,res)=>{
    res.render("index");
});
app.use(express.json());
app.use(cors());

app.use("/",router);

const port =process.env.PORT || 8080;

app.listen(port,()=>{
    console.log("Server Connected to Port");
})
