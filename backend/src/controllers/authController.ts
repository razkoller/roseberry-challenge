import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database';

export const register = async (request: Request, response: Response): Promise<void> => {
    try {
        const { email, password, name } = request.body;

        if (!email || !password || !name) {
            response.status(400).json({ error: 'Email, password, and name are required' });
            return;
        }

        const existingUser = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            response.status(409).json({ error: 'Email already registered' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at',
            [email, hashedPassword, name]
        );

        const user = result.rows[0];
        // TypeScript is being unreasonably strict here about the type of jwt.sign. Even if I add 'as string'. So for
        // now we're just going to ignore it.
        // @ts-ignore
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET!,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        response.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                createdAt: user.created_at
            },
            token
        });
    } catch (error) {
        console.error('Register error:', error);
        response.status(500).json({ error: 'Failed to register user' });
    }
};

export const login = async (request: Request, response: Response): Promise<void> => {
    try {
        const { email, password } = request.body;

        if (!email || !password) {
            response.status(400).json({ error: 'Email and password are required' });
            return;
        }

        const result = await pool.query(
            'SELECT id, email, password, name FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            response.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            response.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        // @ts-ignore
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET!,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        response.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        response.status(500).json({ error: 'Failed to login' });
    }
};