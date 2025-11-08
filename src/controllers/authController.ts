import bcrypt from 'bcrypt';
import { type Request, type Response } from 'express';
import users from '../models/user.ts';
import jwt from 'jsonwebtoken';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */

const registerUser = async (req: Request, res: Response) => {
    try {
        let { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, error: 'Please provide username, email and password' });
        }

        const existingUser = await users.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'User with this email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new users({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json(
            {
                success: true,
                data: {
                    id: newUser._id,
                    username: newUser.name,
                    email: newUser.email
                }
            }
        )
    } catch (err) {
        console.error("Error during user registration:", err);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}

/**
 * @desc    Login a new user
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Please provide email and password' });
        }

        const user = await users.findOne({ email: email }).select('+password');
        // console.log("Found user:", user);
        if (!users) {
            return res.status(400).json({ success: false, error: 'Invalid credentials' });
        }

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ success: false, error: 'Invalid credentials' });
        }

        const payload = {
            user: { id: user._id }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });

        res.status(200).json({
            success: true,
            token: token,
            message: "Login Successful"
        });

    } catch (err) {
        console.error("Error during user login:", err);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}

export {
    registerUser,
    loginUser
};

