import Product from '../models/Product.js';
import handleError from '../utils/handleError.js';

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    handleError(res, 'Failed to fetch products', error.message);
  }
};

// Add a new product
export const addProduct = async (req, res) => {
  const { name, description, price, category, stock, images, ...extraFields } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: 'Missing required fields: name and price' });
  }

  if (Object.keys(extraFields).length > 0) {
    return res.status(400).json({ message: 'Request contains unexpected fields', extraFields: Object.keys(extraFields) });
  }

  try {
    const newProduct = new Product({ name, description, price, category, stock, images });
    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully!', product: newProduct });
  } catch (error) {
    handleError(res, 'Failed to add product', error.message);
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  const { name, description, price, category, stock, images } = req.body;

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return handleError(res, 'Product not found', `No product with ID ${req.params.id}`, 404);
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;
    if (stock) product.stock = stock;
    if (images) product.images = images;

    await product.save();
    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    handleError(res, 'Failed to update product', error.message);
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return handleError(res, 'Product not found', `No product with ID ${req.params.id}`, 404);
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    handleError(res, 'Failed to delete product', error.message);
  }
};
