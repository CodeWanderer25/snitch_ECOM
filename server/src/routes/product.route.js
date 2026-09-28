import express from "express"
import authenticate from "../middleware/auth.middleware.js";
import multer from "multer"
import { productController, listAllProducts, unlistProduct, listProduct, listProductToSeller, deleteProduct } from "../controllers/product.controller.js";
import { productValidator , unlistProductValidator } from "../validators/product.validator.js";


const router = express.Router()

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        files: 5,
        fileSize: 1 * 1024 * 1024
    }
})

router.post("/", authenticate, (req, res, next) => {
    if (req.user.role != "seller") {
        return res.status(403).json({
            message: "User is not authorized to create the product"
        })
    }
    next()
}, upload.array("images"), (req, res, next) => {
        req.body?.price && (req.body.price = JSON.parse(req.body.price))
    req.body?.sizes && (req.body.sizes = JSON.parse(req.body.sizes))
    
        next()
    
}, productValidator, productController)
 
router.get("/" , authenticate , listAllProducts)

router.patch("/unlist/:id" , authenticate , unlistProductValidator ,  (req, res, next) => {
    if (req.user.role != "seller") {
        return res.status(403).json({
            message: "User is forbidden to access"
        })
    }
    next()
},
    unlistProduct
)

router.patch("/list/:id" , authenticate , unlistProductValidator ,  (req, res, next) => {
    if (req.user.role != "seller") {
        return res.status(403).json({
            message: "User is forbidden to access"
        })
    }
    next()
},
    listProduct
)



router.get("/seller" , authenticate  ,  (req, res, next) => {
    if (req.user.role != "seller") {
        return res.status(403).json({
            message: "User is forbidden to access"
        })
    }
    next()
},
    listProductToSeller
)

router.delete(
    "/:id",
    authenticate,
    (req, res, next) => {
        if (req.user.role !== "seller") {
            return res.status(403).json({
                message: "User is forbidden to access"
            });
        }

        next();
    },
    deleteProduct
);






export default router;