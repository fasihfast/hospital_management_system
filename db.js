import mongoose from "mongoose";

export const dbconnection=()=>{
    mongoose.connect(process.env.MONGO_URL,{
        dbName:"Hospital_Management_System",

    }).then(()=>{
        console.log('Connected to db');
    }).catch(err=>{
        console.log(`Error has occurred while connecting to db: ${err}`)
    })
}