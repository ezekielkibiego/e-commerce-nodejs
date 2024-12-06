// utils/handleError.js
const handleError = (res, message, error, statusCode = 500) => {
    res.status(statusCode).json({ message, error });
  };
  
  export default handleError;
  