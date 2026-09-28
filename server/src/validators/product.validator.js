import { body, param, validationResult } from "express-validator";

const productValidator = [
  body("title")
    .trim()
    .exists()
    .withMessage("Title is required")
    .bail()
    .isString()
    .withMessage("Title must be a string")
    .bail()
    .isLength({ min: 2, max: 30 })
    .withMessage("Title must be between 2 and 30 characters"),

  body("description")
    .trim()
    .exists()
    .withMessage("Description is required")
    .bail()
    .isString()
    .withMessage("Description must be a string")
    .bail()
    .isLength({ min: 10, max: 500 })
    .withMessage("Description must be between 10 and 500 characters"),

  // body("images")
  //     .optional()
  //     .isArray({ max: 5 })
  //     .withMessage("Images must be an array with a maximum of 5 images"),

  // body("images.*")
  //     .optional()
  //     .isString()
  //     .withMessage("Each image must be a string").bail()
  //     .isURL()
  //     .withMessage("Each image must be a valid URL"),

  body("price")
    .exists()
    .withMessage("Price is required")
    .bail()
    .isObject()
    .withMessage("Price must be an object"),

  body("price.amount")
    .exists()
    .withMessage("Price amount is required")
    .bail()
    .isFloat({ min: 0 })
    .withMessage("Price amount must be a float")
    .bail()
    .custom((value) => {
      if (value < 0) {
        throw new Error("Price amount cannot be negative");
      }
      return true;
    }),

  body("price.currency")
    .exists()
    .withMessage("Price currency is required")
    .bail()
    .isString()
    .withMessage("price currency must be a string")
    .bail()
    .isIn(["INR", "USD"])
    .withMessage("Currency must be either INR or USD"),

  body("sizes")
    .exists()
    .withMessage("Sizes are required")
    .bail()
    .isArray()
    .withMessage("Sizes must be an array"),

  body("sizes.*.size")
    .exists()
    .withMessage("Size is required")
    .bail()
    .isIn(["XS", "S", "M", "L", "XL", "XXL"])
    .withMessage("Invalid size"),

  body("sizes.*.stock")
    .exists()
    .isInt({ min: 0 })
        .withMessage("Stock must be a non-negative integer"),
  
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors) {
      return res.status(400).json({
        message: "Invalid Request",
        errors: errors.array(),
      });
    }
    next()
  },
];
 const unlistProductValidator = [

    param("id")
        .exists().withMessage("product id is required in req params").bail()
        .isMongoId().withMessage("product is must be a valid mongo object id"),

    (req, res, next) => {

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "invalid Data",
                errors: errors.array()
            })
        }

        next()

    }


]

export {productValidator , unlistProductValidator};
