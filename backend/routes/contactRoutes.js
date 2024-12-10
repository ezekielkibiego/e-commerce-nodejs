import express from 'express';
import { createContact, getAllContacts } from '../controllers/contactController.js';

const router = express.Router();

// Route to create a new contact message
router.post('/', createContact);

// Route to get all contact messages
router.get('/', getAllContacts);

export default router;