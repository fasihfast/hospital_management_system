import { User } from '../models/userSchema.js'; // adjust path if needed
import {catchAsyncErrors} from "../middlewares/catchAsyncError.js"
import ErrorHandler from "../middlewares/errorMiddleware.js"
import {generateToken} from "../utils/jwtToken.js"
import cloudinary from "cloudinary"

export const patientRegister = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, password, gender, dob, cnic, role } = req.body;

    if (!firstName || !lastName || !email || !phone || !password || !gender || !dob || !cnic || !role) {
        return next(new ErrorHandler("Please Fill Full Form!", 400));
    }

    let user = await User.findOne({ email }); // 🟢 Use `let` here instead of `const`

    if (user) {
        return next(new ErrorHandler("User already registered !", 400));
    }

    user = await User.create({ firstName, lastName, email, phone, password, gender, dob, cnic, role });
    generateToken(user,"User Registered!",200,res)
});


export const login = catchAsyncErrors(async(req,res,next)=>{
    const {email , password , confirmPassword , role}=req.body;
    if (!email || !password || !confirmPassword || !role){
        return next(new ErrorHandler("Please provide complete details! ",400));

    }

    if(password !== confirmPassword){
        return next(new ErrorHandler("Passwrod and Confirm Password does not match ",400));
    }

    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid Password or email ",400));

    }

    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Password or email ",400));
    }

    if (role !== user.role){
        return next(new ErrorHandler("User with this role not found ",400));

    }

    generateToken(user,"User Login Successfully",200,res)

})

export const addNewAdmin = catchAsyncErrors(async(req,res,next)=>{
    const { firstName, lastName, email, phone, password, gender, dob, cnic} = req.body;

    if (!firstName || !lastName || !email || !phone || !password || !gender || !dob || !cnic ) {
        return next(new ErrorHandler("Please Fill Full Form!", 400));
    }

    const isRegistered = await User.findOne({email});
    if(isRegistered){
        return next(new ErrorHandler(`${isRegistered.role} with this email already exists! `));

    }

    const admin = await User.create({firstName, lastName, email, phone, password, gender, dob, cnic,role:"Admin"})
    res.status(200).json({
        success:true,
        message:"New Admin Registered"
    })
})


export const getAllDoctors = catchAsyncErrors(async(req,res,next)=>{
    const doctors = await User.find({role:"Doctor"});
    res.status(200).json({
        success:true,
        doctors,
    })
})

export const getUserDetails= catchAsyncErrors(async(req,res,next)=>{
    const user=req.user
    res.status(200).json({
        success:true,
        user,
    })
})

export const logoutAdmin = catchAsyncErrors(async(req,res,next)=>{
    res.status(200).cookie("adminToken","",{
        httpOnly: true,
        expires: new Date(Date.now()),
    }).json({
        success:true,
        message:"Admin Logged Out Successfully"
    })


})

export const logoutPatient = catchAsyncErrors(async(req,res,next)=>{
    res.status(200).cookie("patientToken","",{
        httpOnly: true,
        expires: new Date(Date.now()),
    }).json({
        success:true,
        message:"Patient Logged Out Successfully"
    })


})

export const addNewDoctor = catchAsyncErrors(async(req,res,next)=>{
    if (!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler("Doctor Avatar Required!",400));

    }
    console.log(req.files);
    const {docAvatar}=req.files;
    const allowedFormats = ["image/png","image/jpeg","image/webp"];
    if (!allowedFormats.includes(docAvatar.mimetype)){
        return next(new ErrorHandler("File Format Not Supported!", 400));

    }
    const {firstName, lastName, email, phone, password, gender, dob, cnic,doctorDepartment} = req.body
  if (!firstName || !lastName || !email || !phone  || !password || !gender || !dob || !cnic || !doctorDepartment) {
    return next(new ErrorHandler("Please Provide Full details ",400));

  } 
  const isRegistered = await User.findOne({email});
  if(isRegistered){
    return next(new ErrorHandler(`${isRegistered.role} already registered with this email`,400));

  }

  const cloudinaryResponse = await cloudinary.uploader.upload(docAvatar.tempFilePath, {
    resource_type: "auto" // this allows automatic detection of the file type
  });

  if (!cloudinaryResponse || cloudinaryResponse.error){
    console.error("Cloudinary Error: ",cloudinaryResponse.error || "Unknown Cloudinary Error")
  }

  const doctor = await User.create({firstName, lastName, email, phone, password, gender, dob, cnic,doctorDepartment,role:"Doctor",docAvatar:{
    public_id: cloudinaryResponse.public_id,
    url: cloudinaryResponse.secure_url,
  }})

  res.status(200).json({
    success:true,
    message:"New Doctor Registered! ",
    doctor

  })
})