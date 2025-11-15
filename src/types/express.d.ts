import { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface UserPayLoad {
            id: string;
        }

        interface Request {
            user?: UserPayLoad | JwtPayload | string;
        }
    }
}

export { };
