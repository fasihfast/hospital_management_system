import { Message } from '../models/messageSchema.js'; // adjust path if needed
import {catchAsyncErrors} from "../middlewares/catchAsyncError.js"
import ErrorHandler from "../middlewares/errorMiddleware.js"

export const sendMessage = catchAsyncErrors(async (req, res, next) => {
    console.log(`Request body : ${req.body}`)
    const { firstName, lastName, email, phone, message } = req.body;

    if (!firstName || !lastName || !email || !phone || !message) {
       return next(new ErrorHandler("Please Fill Full Form!!",400))
    }

        await Message.create({ firstName, lastName, email, phone, message });

        res.status(200).json({
            success: true,
            message: "Message sent successfully"
        });
    
});
