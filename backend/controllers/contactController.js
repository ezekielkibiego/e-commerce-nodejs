import Contact from '../models/Contact.js';
import handleError from '../utils/handleError.js';

// Create a new contact message
export const createContact = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();
    res.status(201).json({ message: 'Contact message sent successfully!', contact: newContact });
  } catch (error) {
    handleError(res, 'Failed to send contact message', error.message);
  }
};

// Get all contact messages
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    handleError(res, 'Failed to fetch contact messages', error.message);
  }
};