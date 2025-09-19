import { Request } from "express";

declare global {
    interface IUser {
        id: string;
        name: string;
        email: string;
        password: string;
        role: string;
        avatar?: string;
        playlist: string[];
    }

    interface IAuthenticatedRequest extends Request {
        isAuth?: boolean;
        userId?: string;
        userRole?: string;
    }
}

export { };