import express from "express";
import connectDB from "./config/db.js";
import ejs from 'ejs';
import router from "./routes/files.js";
import show from "./routes/show.js";
import path from "path";
import { fileURLToPath } from 'url';
import download from "./routes/download.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app=express();
const PORT=process.env.PORT || 3000;

connectDB();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.set("views",path.join(__dirname,"/views"));
app.set("view engine","ejs");
app.use("/api/files",router);
app.use("/files",show);
app.use("/files/download",download);




app.listen(PORT,()=>{
console.log(`Connecting to server ${PORT}`);
});
