import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // State for success message
  const [successMessage, setSuccessMessage] = useState('');

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${baseURL}/contacts`, data);
      setSuccessMessage(response.data.message); // Set success message
      reset(); // Reset form fields

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error submitting the form:', error);
      alert(error.response?.data?.message || 'Failed to submit the form');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 p-10 bg-white shadow-2xl rounded-lg">
      <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">Get in Touch</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-1">
          <label className="block text-gray-700 font-medium mb-2">Name:</label>
          <input
            type="text"
            {...register('name', { required: 'Name is required' })}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div className="md:col-span-1">
          <label className="block text-gray-700 font-medium mb-2">Email:</label>
          <input
            type="email"
            {...register('email', { required: 'Email is required' })}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-gray-700 font-medium mb-2">Subject:</label>
          <input
            type="text"
            {...register('subject', { required: 'Subject is required' })}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-gray-700 font-medium mb-2">Message:</label>
          <textarea
            {...register('message', { required: 'Message is required' })}
            className="w-full p-3 border rounded-md h-40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>

        {successMessage && (
          <div className="md:col-span-2">
            <p className="text-green-600 font-semibold text-center mt-4">{successMessage}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default ContactForm;
