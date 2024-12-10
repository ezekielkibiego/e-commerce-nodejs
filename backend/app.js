import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import authRouter from './routes/authRouter.js';
import contactRoutes from './routes/contactRoutes.js';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());


// Routes
app.use('/products', productRoutes);
app.use('/api/auth', authRouter)
app.use('/api/contacts', contactRoutes);

// Connect to Database and Start Server
const PORT = process.env.PORT || 5000;

connectDB().then(() =>
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
);
