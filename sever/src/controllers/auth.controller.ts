import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { NODE_ENV, PRIVATE_KEY, SALT_ROUNDS, TOTAL_MS_IN_DAY } from "../utils/configs/constants.js";
import { ErrorCustom, RequestHandlerCustom } from "../utils/configs/custom.js";
import { redisClient } from "../utils/libs/database.js";
import { handleGetUserByEmail, handleUpdateUserPasswordByEmail, handleUpdateUserStatusByEmail } from "../repositories/user.repository.js";
import { EUserStatus } from "../utils/types/enum.js";
import { parseRequestData } from "../utils/configs/helper.js";
import { generateRandomPassword, handleCreateAndStoreOTP } from "../services/auth.service.js";
import { EmailTemplate, sendMail } from "../utils/libs/mailer.js";

export const verifyOTP = RequestHandlerCustom(async (req, res, next) => {
    const data = parseRequestData(req);
    const { email, otp } = data;

    const otpKey = `otp:${email}`;
    const storedOTP = await redisClient.get(otpKey);

    if (storedOTP !== otp) {
        return next(new ErrorCustom(400, "Invalid OTP"));
    }

    const user = await handleGetUserByEmail({ email });

    if (!user) {
        return next(new ErrorCustom(404, "User not found"));
    }

    await handleUpdateUserStatusByEmail({ email, status: EUserStatus.ACTIVE });

    await redisClient.del(otpKey);

    res.status(200).json({
        success: true,
        message: "OTP verified"
    });
});

export const sendOTP = RequestHandlerCustom(async (req, res, next) => {
    const data = parseRequestData(req);
    const { email } = data;

    // Tạo OTP và lưu trong Redis
    const otpResult = await handleCreateAndStoreOTP(email);
    if ("error" in otpResult) {
        const errorStatus = (otpResult as { status?: number }).status || 500;
        return next(new ErrorCustom(errorStatus, String(otpResult?.error) || "Internal server error"));
    }

    // Lấy thông tin user nếu đã đăng ký
    const userName = email.split('@')[0];

    // Lấy năm hiện tại
    const currentYear = new Date().getFullYear();

    // Chuẩn bị dữ liệu cho template email
    const templateData = {
        logoUrl: "https://example.com/logo.png", // Thay thế bằng URL thực của logo
        title: "Xác thực tài khoản của bạn",
        greeting: "Xin chào",
        name: userName,
        message: "Cảm ơn bạn đã đăng ký tài khoản với VietAu Academy. Vui lòng sử dụng mã OTP dưới đây để xác thực tài khoản của bạn.",
        otp: otpResult.otp,
        expiry: "5", // OTP hết hạn sau 5 phút (được cài đặt trong handleCreateAndStoreOTP)
        contactEmail: "VietAuAcademy@gmail.com",
        year: currentYear.toString(),
        address: "123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh, Việt Nam",
    };

    // Gửi email
    await sendMail(
        email,
        "Mã xác thực OTP từ VietAu Academy",
        EmailTemplate.SEND_OTP,
        templateData
    );

    res.status(200).json({
        success: true,
        message: "OTP sent successfully"
    });
});

export const login = RequestHandlerCustom(async (req, res, next) => {
    const data = parseRequestData(req);
    const { email, password } = data;

    if (!email || !password) {
        return next(new ErrorCustom(400, "Please input full information"));
    }

    const user = await handleGetUserByEmail({ email });

    if (!user) {
        return next(new ErrorCustom(404, "User not found"));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return next(new ErrorCustom(400, "Invalid credential"));
    }

    const isInactive = await user.status === EUserStatus.INACTIVE;
    if (isInactive) {
        return next(new ErrorCustom(400, "User is not active"));
    }

    const token = jwt.sign(
        {
            id: user._id,
        },
        PRIVATE_KEY,
        {
            expiresIn: "7d",
            algorithm: "HS256",
        }
    );

    res.cookie("token", token as string, {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * TOTAL_MS_IN_DAY
    });

    const { password: pass, ...userWithoutPassword } = user.toObject();

    res.status(200).json({
        success: true,
        message: "Login successful",
        user: userWithoutPassword,
        isActive: true,
    });

});

export const logout = RequestHandlerCustom(async (req, res, next) => {
    if (!req.userId) {
        return next(new ErrorCustom(403, "Not authenticated"));
    }

    // Clear cookie regardless of Redis status
    res.clearCookie("token", {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: "strict",
    });

    res.status(200).json({
        success: true,
        message: "Logout successful"
    });
});

// API 1: Reset Password
export const resetPassword = RequestHandlerCustom(async (req, res, next) => {
    const data = parseRequestData(req);
    const { email } = data;

    const user = await handleGetUserByEmail({ email });

    if (!user) {
        return next(new ErrorCustom(404, "User not found"));
    }

    const newPassword = generateRandomPassword();

    // Hash mật khẩu mới
    const salt = parseInt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Cập nhật mật khẩu mới trong database
    await handleUpdateUserPasswordByEmail({ email, password: hashedPassword });

    // Lấy thông tin user
    const userName = email.split('@')[0];

    // Lấy năm hiện tại
    const currentYear = new Date().getFullYear();

    // Chuẩn bị dữ liệu cho template email
    const templateData = {
        logoUrl: "https://example.com/logo.png",
        name: userName,
        password: newPassword,
        contactEmail: "VietAuAcademy@gmail.com",
        year: currentYear.toString(),
        address: "123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh, Việt Nam",
    };

    // Gửi email với mật khẩu mới
    await sendMail(
        email,
        "Mật khẩu mới của bạn - VietAu Academy",
        EmailTemplate.SEND_PASSWORD,
        templateData
    );

    res.status(200).json({
        success: true,
        message: "Password has been reset. New password sent to email."
    });
});

// API 2: Forgot Password
export const forgotPassword = RequestHandlerCustom(async (req, res, next) => {
    const data = parseRequestData(req);
    const { email, password, confirmPassword } = data;

    // Kiểm tra xem user có tồn tại không
    const user = await handleGetUserByEmail({ email });
    if (!user) {
        return next(new ErrorCustom(404, "User not found"));
    }

    // Kiểm tra mật khẩu và xác nhận mật khẩu có khớp không
    if (password !== confirmPassword) {
        return next(new ErrorCustom(400, "Passwords do not match"));
    }

    // Kiểm tra độ mạnh của mật khẩu nếu cần
    if (password.length < 6) {
        return next(new ErrorCustom(400, "Password must be at least 6 characters long"));
    }

    // Hash mật khẩu mới
    const salt = parseInt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Cập nhật mật khẩu
    await handleUpdateUserPasswordByEmail({ email, password: hashedPassword });

    res.status(200).json({
        success: true,
        message: "Password has been reset successfully"
    });
});

// API 3: Change Password
export const changePassword = RequestHandlerCustom(async (req, res, next) => {
    const data = parseRequestData(req);
    const { email, oldPassword, newPassword, confirmPassword } = data;

    // Kiểm tra xem user có tồn tại không
    const user = await handleGetUserByEmail({ email });
    if (!user) {
        return next(new ErrorCustom(404, "User not found"));
    }

    // Kiểm tra oldPassword có khớp với mật khẩu hiện tại không
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        return next(new ErrorCustom(400, "Current password is incorrect"));
    }

    // Kiểm tra newPassword và confirmPassword có khớp không
    if (newPassword !== confirmPassword) {
        return next(new ErrorCustom(400, "New passwords do not match"));
    }

    // Kiểm tra độ mạnh của mật khẩu mới nếu cần
    if (newPassword.length < 6) {
        return next(new ErrorCustom(400, "New password must be at least 6 characters long"));
    }

    // Hash mật khẩu mới
    const salt = parseInt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Cập nhật mật khẩu
    await handleUpdateUserPasswordByEmail({ email, password: hashedPassword });

    res.status(200).json({
        success: true,
        message: "Password changed successfully"
    });
});