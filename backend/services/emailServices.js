import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const sendMail=async ({from,to,subject,text,html})=>{

let transporter= nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
     user: process.env.MAIL_USER,
     pass: process.env.MAIL_PASS
}

});

let info=await transporter.sendMail({
    from: `shareZone <${from}>`,
    to,
    subject,
    text,
    html

});



};

export default sendMail;

