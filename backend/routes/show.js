import express from "express";
import File from "../models/file.js";
import dotenv from "dotenv";


dotenv.config();
const router=express.Router();

router.get("/:uuid",async (req,res)=>{
try{
   const file=await File.findOne({uuid: req.params.uuid});

   if(!file){
      return res.render("download",{error:"Something went wrong"});

}

     return res.render("download",{
       uuid: file.uuid,
       fileName: file.filename,
       fileSize: file.size,
       downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`
});

 } catch(err){
   return res.render("download",{error:"Something went wrong."});
}


});

export default router;
