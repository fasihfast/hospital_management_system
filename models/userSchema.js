import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema= new mongoose.Schema({
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

    cnic:{
        type: String,
        required:true,
        minLength:[13,"Min characters should be 13"],
        maxLength:[13,"Min characters should be 13"]
    },

    dob:{
        type:Date,
        require:[true,"DOB is required"]
    },

    gender:{
        type:String,
        require:true,
        enum:["Male","Female","Gender"]
    },

    password:{
        type:String,
        minLength:[5,"Minlength should be >=5"],
        require:true,
        select: false

    },
    role:{
        type:String,
        require:true,
        enum:["Admin","Patient","Doctor"]
    },
    doctorDepartment:{
        type:String
    },

    docAvatar:{
        public_id:String,
        url:String
    }

})

userSchema.pre("save",async function(next){
 if (!this.isModified("password")){
    next();
 }
 this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.comparePassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

userSchema.methods.generateJsonWebToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{expiresIn:process.env.JWT_EXPIRES});
}

export const User=mongoose.model("User",userSchema);