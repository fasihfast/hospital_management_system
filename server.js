import app from "./app.js"
import cloudinary from "cloudinary"

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_secret:process.env.CLOUDINARY_API_SECRET,
    api_key:process.env.CLOUDINARY_KEY,
})

app.listen(process.env.PORT,()=>{
    console.log("Server is live ");
})