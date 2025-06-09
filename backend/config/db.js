import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


const connectDB=()=>{
mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("Database connected"))
.catch(()=>console.log("Connection Failed"));

};

export default connectDB;
