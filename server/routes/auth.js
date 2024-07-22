import { Router } from "express";

const router = Router();

import { registerUser } from "../controllers/auth.js";

router.post("/register", registerUser);

export default router ; 
