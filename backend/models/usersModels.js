import Joi from 'joi';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email required'],
      trim: true,
      unique: [true, 'Should be unique'],
      minlength: [5, 'Must have 5 characters'],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password must be provided'],
      trim: true,
      select: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      select: false,
    },
    verificationCodeValidation: {
      type: Number,
      select: false,
    },
    forgotPasswordCode: {
      type: String,
      select: false,
    },
    forgotPasswordCodeValidation: {
      type: Number,
      select: false,
    },
  },
  {
    timestamps: true, 
  }
);

export default mongoose.model('User', userSchema);
