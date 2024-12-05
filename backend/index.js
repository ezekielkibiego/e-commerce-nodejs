import express from 'express'
import productRoutes from './routes/products.js'
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json())
app.use('/products', productRoutes);

const DB_NAME = process.env.DB_NAME;
const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;


mongoose
  .connect(DB_URL)
  .then(() => {
    console.log(`Connected to MongoDB database: ${DB_NAME}`);
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.error('Error connecting to MongoDB:', error.message));
