import {body, validationResult} from "express-validator"
const registerValidator = [
    body("email")
        .exists().withMessage("Email is required").bail()
        .trim()
        .isEmail().withMessage("Enter valid email"),
    body("name")
        .exists().withMessage("Name is required").bail()
        .isString().withMessage("Name must be in string")
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage("enter name with 2 and 50"),
    body("password")
        .exists().withMessage("Password is required").bail()
        .isString().withMessage("Password must be in string")
        .trim()
        .isLength({ min: 6 }).withMessage("Minimum 6 length of password required"),
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Invalid Request",
                errors:errors.array()
            })
        }
        next()
    }
    

        
    
]


const loginValidator = [
    body("email")
        .exists().withMessage("Email is required").bail()
        .isString().withMessage("email must be in string")
        .trim()
        .isEmail().withMessage("Enter valid email"),

    body("password")
        .exists().withMessage("Password is required").bail()
        .isString().withMessage("Password must be in string")
        .trim()
        .isLength({ min: 6 })
        .withMessage("Minimum 6 length of password required"),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Invalid Request",
                errors: errors.array()
            });
        }

        next();
    }
];

export default loginValidator;


export  {registerValidator , loginValidator}