import jwt from 'jsonwebtoken';
import { type Request, type Response, type NextFunction } from 'express';
import "dotenv/config";

const auth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('x-auth-token');
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }

    if (!token) {
        return next();
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
        req.user = decoded.user
        next();

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown Issue";
        console.error("Token Varification Failed", errorMessage);
        res.status(400).json({
            success: false, error: "Token is not valid."
        })
    }
}

export { auth };