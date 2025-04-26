import mongoose from 'mongoose'
import validator from 'validator'

const messageSchema= new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:[3,"Number of Characters should be >= 3"]
    },

    lastName:{
        type:String,
        required:true,
        minLength:[3,"Number of Characters should be >= 3"]
    },
    email:{
        type:String,
        required:true,
        validate:[validator.isEmail,"Invalid email address"]
    },

    phone: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                // Ensures that the phone number is exactly 11 digits long
                return /^\d{11}$/.test(v);
            },
            message: "Phone number should consist of exactly 11 digits"
        }
    },

    message:{
        type: String,
        required:true,
        minLength:[10,"Min characters should be 10"]
    }
})

export const Message=mongoose.model("Message",messageSchema);


