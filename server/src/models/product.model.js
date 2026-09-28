import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 2,
        maxLength:30
    },
    description: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 500
    },
    images: {
        type: [{
            type: String,
        }],
        validate: {
            validator: images=> images.length <=5
        }
    },
    price: {
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            enum: ["INR", "USD"],
            default:"INR"
        }
    },

    sizes: [
        {
            size: {
                type: String,
                enum: ["XS", "S", "M", "L", "XL", "XXL"],
                required: true
            },
            stock: {
                type: Number,
                min: 0,
                default:0
            }
        }
    ],

    seller: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    published: {
        type: Boolean,
        default: false
    }
})

const productModel = mongoose.model("Product", productSchema)
export default productModel

