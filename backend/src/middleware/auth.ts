import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    userId?: number;
}

export const authenticateToken = (
    request: AuthRequest,
    response: Response,
    next: NextFunction
): void => {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        response.status(401).json({ error: 'Access token required' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
        request.userId = decoded.userId;
        next();
    } catch (error) {
        response.status(403).json({ error: 'Invalid or expired token' });
    }
};