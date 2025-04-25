import express from "express";
import { config } from "dotenv";    
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";    
import messageRouter from "./Routers/messageRouter.js"
import userRouter from "./Routers/userRouter.js"
import  {errorMiddleware}  from "./middlewares/errorMiddleware.js";
import { dbconnection } from "./db.js";    


const app=express();
config({
    path:"./config/config.env"
})

app.use(cors({
    origin:[process.env.FRONTEND_URL,process.env.DASHBOARD_URL],
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
}));

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/"
}))



app.use("/api/v1",messageRouter);
app.use("/api/v1",userRouter)



dbconnection();
app.use(errorMiddleware);
export default app;