import { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface User {
            id: string;
            [key: string]: any;
        }

        interface Request {
            user?: User | JwtPayload | string;
        }
    }
}

export {};
