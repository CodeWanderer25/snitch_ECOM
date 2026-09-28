import express from "express"
import authenticate from "../middleware/auth.middleware.js"
import validateCart from "../validators/cart.validator.js"
import { addToCart , getCart } from "../controllers/cart.controller.js"

const router = express.Router()

router.post("/", authenticate, validateCart, addToCart)
router.get("/" , authenticate , validateCart , getCart)

export default router