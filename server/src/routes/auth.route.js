import express from "express"
import {registerValidator,  loginValidator } from "../validators/auth.validator.js";
import {registerController, loginController, refresh, getMe } from "../controllers/register.controller.js";
import authenticate from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerValidator, registerController)
router.post("/login", loginValidator, loginController)
router.post("/refresh", refresh)
router.get("/me" , authenticate, getMe)

export default router;