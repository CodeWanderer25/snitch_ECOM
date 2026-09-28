import { body, validationResult } from "express-validator";

 const validateCart = [
    body("products")
        .isArray({ min: 1 })
        .withMessage("Products must be a non-empty array"),

    body("products.*.product")
        .notEmpty()
        .withMessage("Product ID is required").bail()
        .isMongoId()
        .withMessage("Invalid product ID"),

    body("products.*.quantity")
        .isInt({ min: 1 })
        .withMessage("Quantity must be at least 1"),

    body("products.*.sizes")
        .isIn(["XS", "S", "M", "L", "XL", "XXL"])
        .withMessage("Invalid size"),

    body("user")
        .notEmpty()
        .withMessage("User ID is required").bail()
        .isMongoId()
        .withMessage("Invalid user ID"),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        next();
    },
];

export default validateCart