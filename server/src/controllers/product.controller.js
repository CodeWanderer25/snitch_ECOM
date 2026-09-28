import productModel from "../models/product.model.js"
import uploadFile from "../services/storage.services.js"


const productController = async(req, res) => {
    console.log(req.body)
    console.log(req.files)

    const filesUrl = []

    for (let i = 0; i < req.files.length; i++){
        const response = await uploadFile({
            buffer:  req.files[i].buffer,
            fileName: req.files[i].originalname
        })

        filesUrl.push(response.url)
    }
    console.log(filesUrl)

    const product = await productModel.create({
        title: req.body.title,
        description: req.body.description,
        price: {
            amount: req.body.price.amount,
            currency: req.body.price.currency
        },
        sizes: req.body.sizes,
        images: filesUrl,
        seller: req.user.userId
    })

    return res.status(201).json({
        message: "Product created Successfully",
        data: {
            product
        }
    })
}

const listAllProducts = async (req, res) => {
    
    const getProduct = await productModel.find();

    console.log(getProduct)

    return res.status(201).json({
        message: "product fetched successfully",
        data: {
            getProduct
        }
    })
    
}

const unlistProduct = async(req , res) => {
    const { id } = req.params

    const product = await productModel.findById(id)

    if (!product) {
        return res.status(404).json({
            message: "product not found by id"
        })
    }

    
    await productModel.findByIdAndUpdate(id, {
        published: false
    })

    return res.status(200).json({
        message: "Product unpublished successfully"
    })

}

const listProduct = async(req , res) => {
    const { id } = req.params

    const product = await productModel.findById(id)

    if (!product) {
        return res.status(404).json({
            message: "product not found by id"
        })
    }

    await productModel.findByIdAndUpdate(id, {
        published: true
    })

    return res.status(200).json({
        message: "Product published successfully"
    })
}

const listProductToSeller = async(req , res) => {
    const products = await productModel.find({})

    return res.status(200).json({
        message: "All products fetched successfully",
        data: {
            products
        }
    })
}


const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const sellerId = req.user.userId;

        const product = await productModel.findOne({
            _id: productId,
            seller: sellerId,
        });

        if (!product) {
            return res.status(404).json({
                message: "Product not found or you are not authorized to delete it"
            });
        }

        await productModel.deleteOne({
            _id: productId,
            seller: sellerId,
        });

        return res.status(200).json({
            message: "Product deleted successfully",
        });

    } catch (error) {
        console.error("DELETE PRODUCT ERROR:", error);

        return res.status(500).json({
            message: "Failed to delete product",
        });
    }
};



export  {productController , listAllProducts , unlistProduct , listProduct , listProductToSeller , deleteProduct}