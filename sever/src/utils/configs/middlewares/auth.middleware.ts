import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PRIVATE_KEY } from "../constants.js";
import { JwtPayload } from "jsonwebtoken";

interface IDecodedToken extends JwtPayload {
    id: string;
    role?: string;
}

/**
 * Middleware kiểm tra xác thực người dùng qua JWT
 */
export const isAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            res.status(403).json({
                message: "Please login",
            });
            return;
        }

        const decodedValue = jwt.verify(
            token,
            PRIVATE_KEY
        ) as IDecodedToken;

        if (!decodedValue || !decodedValue.id) {
            return res.status(403).json({
                message: "Token is invalid",
            });
        }

        req.userId = decodedValue.id;
        req.isAuth = true;
        next();
    } catch (error) {
        res.status(403).json({
            message: "Please login",
        });
    }
};

/**
 * Danh sách các route công khai không cần xác thực
 */
const PUBLIC_ROUTES = [
    '/api/v1/auth/login',
    '/api/v1/auth/register',
    '/api/v1/auth/send-otp',
    '/api/v1/auth/verify-otp',
    '/api/v1/blogs',
    '/api/v1/programs',
    '/api/v1/jobs',
    '/api/v1/faqs',
];

/**
 * Middleware kiểm tra xem route hiện tại có cần xác thực không
 */
export const checkPublicRoute = (req: Request, res: Response, next: NextFunction) => {
    // Kiểm tra xem đường dẫn hiện tại có nằm trong danh sách công khai không
    if (PUBLIC_ROUTES.some(route => req.path.startsWith(route))) {
        return next();
    }

    isAuth(req, res, next);
}