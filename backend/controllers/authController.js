import jwt from 'jsonwebtoken';
import { signinSchema, signupSchema } from '../middlewares/validator.js';
import User from '../models/usersModels.js';
import { doHash, doHashValidation } from '../utils/hashing.js';

export const signup = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate input
        const { error } = signupSchema.validate({ email, password });
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User already exists',
            });
        }

        // Hash password
        const hashPassword = await doHash(password, 12);

        // Save new user
        const newUser = new User({
            email,
            password: hashPassword,
        });
        const result = await newUser.save();

        // Hide password in the response
        result.password = undefined;

        return res.status(201).json({
            success: true,
            message: 'Account created successfully',
            result,
        });
    } catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).json({
            success: false,
            message: 'An internal server error occurred during signup',
        });
    }
};

export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate input
        const { error } = signinSchema.validate({ email, password });
        if (error) {
            return res.status(401).json({
                success: false,
                message: error.details[0].message,
            });
        }

        // Find user and include password
        const existingUser = await User.findOne({ email }).select('+password');
        if (!existingUser) {
            return res.status(401).json({
                success: false,
                message: 'User does not exist',
            });
        }

        // Validate password
        const isPasswordValid = await doHashValidation(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials!',
            });
        }

        // Create JWT
        const token = jwt.sign(
            {
                userID: existingUser._id,
                email: existingUser.email,
                verified: existingUser.verified,
            },
            process.env.TOKEN_SECRET,
            {
                expiresIn: '8h',
            }
        );

        // Set cookie and respond
        res.cookie('Authorization', `Bearer ${token}`, {
            expires: new Date(Date.now() + 8 * 3600000),
            httpOnly: process.env.NODE_ENV === 'production',
            secure: process.env.NODE_ENV === 'production',
        }).json({
            success: true,
            token,
            message: 'Logged in successfully',
        });
    } catch (error) {
        console.error('Error during signin:', error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
        });
    }
};

export const signout = async (req, res) => {
    try {
        res.clearCookie('Authorization');
        return res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (error) {
        console.error('Error during signout:', error);
        return res.status(500).json({
            success: false,
            message: 'An internal server error occurred during signout',
        });
    }
};
