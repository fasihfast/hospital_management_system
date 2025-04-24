import { sendMessage } from "../controllers/messageController.js";
import express from "express"

const router=express.Router();

router.post("/send",sendMessage);

export default router;
