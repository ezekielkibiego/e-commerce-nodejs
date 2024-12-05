import express from 'express'
import mongoose from 'mongoose';

const router = express.Router();

// MongoDB Schema and Model

const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String},
    price: {type: Number, required: true},
    category: {type: String},
    stock: {type: Number, default: 0},
    images: [{type: String}],
    createdAt: {type: Date, default: Date.now},
},
{strict: true}
);

const handleError = (res, message, error, statusCode = 500) => {
    res.status(statusCode).json({ message, error });
  };
  
const Product = mongoose.model('Product', productSchema);

// Get all products
router.get('/', async(req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products)
    } catch (error) {
       res.status(500).json({ message: "Failed to fetch products", error: error.message});
    };
});

// Add a new product
router.post('/', async(req, res) => {
    const {name, description, price, category, stock, images, ...extraFields} = req.body;

    if (!name || !price) {
        return res.status(400).json({
            message: 'Missing required fields: name and price',
        });
    }

    if (Object.keys(extraFields).length > 0) {
        return res.status(400).json({
            message: "Request contains unexpected field",
            extraFields: Object.keys(extraFields),
        })
    }

    try {
        const newProduct = new Product({name, description, price, category, stock, images});
        await newProduct.save();
        res.status(201).json({message: 'Product added successfully!', product: newProduct});
    } catch (error) {
        res.status(500).json({ message: "Failed to add product", error: error.message}); 
    }
});

// Update a product by ID

router.patch('/:id', async (req, res) => {
    const {name, description, price, category, stock, images} = req.body;
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return handleError( res, 'Product not found', `No product with ID ${req.params.id}`, 404)
        }
        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = price;
        if (category) product.category = category;
        if (stock) product.stock = stock;
        if (images) product.images = images;

        await  product.save();
        res.status(200).json({ message: 'Product updated successfully', product});
    } catch (error) {
        handleError(res, 'Failed to update product', error.message);
    }

});

// Delete a product by ID

router.delete('/:id', async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
  
      if (!product) {
        return handleError(res, 'Product not found', `No product with ID ${req.params.id}`, 404);
      }
  
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      handleError(res, 'Failed to delete product', error.message);
    }
  });

export default router;