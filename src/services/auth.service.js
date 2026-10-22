import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import prisma from "../config/prisma.js";


// =========================
// Đăng ký User
// =========================

export async function registerUser(
    username,
    fullname,
    password
) {
    // =========================
    // 1. Kiểm tra username trùng
    // =========================

    const existingUser = await prisma.user.findUnique({
        where: {
            username
        }
    });

    if (existingUser) {
        const error = new Error(
            "Username already exists"
        );

        error.statusCode = 409;

        throw error;
    }


    // =========================
    // 2. Tìm role normal
    // Theo yêu cầu bảng chấm
    // =========================

    const normalRole = await prisma.role.findFirst({
        where: {
            rolename: "normal"
        }
    });

    if (!normalRole) {
        const error = new Error(
            "normal role not found"
        );

        error.statusCode = 500;

        throw error;
    }


    // =========================
    // 3. Tìm Membership BASIC
    // BASIC hiện có score = 10
    // =========================

    const basicMembership =
        await prisma.membership.findFirst({
            where: {
                mname: "BASIC"
            }
        });

    if (!basicMembership) {
        const error = new Error(
            "BASIC membership not found"
        );

        error.statusCode = 500;

        throw error;
    }


    // =========================
    // 4. Hash password
    // =========================

    const hashedPassword = await bcrypt.hash(
        password,
        10
    );


    // =========================
    // 5. Tạo User
    // User mới tự động:
    // role = normal
    // membership = BASIC
    // score = 10
    // =========================

    const user = await prisma.user.create({
        data: {
            username,
            fullname,

            password: hashedPassword,

            roleid: normalRole.roleid,

            mid: basicMembership.mid
        },

        select: {
            uid: true,

            username: true,

            fullname: true,

            role: {
                select: {
                    rolename: true
                }
            },

            membership: {
                select: {
                    mname: true,
                    score: true
                }
            }
        }
    });


    return user;
}


// =========================
// Đăng nhập User
// =========================

export async function loginUser(
    username,
    password
) {
    // =========================
    // 1. Tìm User
    // =========================

    const user = await prisma.user.findUnique({
        where: {
            username
        },

        include: {
            role: true,
            membership: true
        }
    });


    // =========================
    // 2. Username không tồn tại
    // =========================

    if (!user) {
        const error = new Error(
            "Invalid username or password"
        );

        error.statusCode = 401;

        throw error;
    }


    // =========================
    // 3. Kiểm tra password
    // =========================

    const passwordMatched =
        await bcrypt.compare(
            password,
            user.password
        );


    if (!passwordMatched) {
        const error = new Error(
            "Invalid username or password"
        );

        error.statusCode = 401;

        throw error;
    }


    // =========================
    // 4. Tạo JWT
    // =========================

    const token = jwt.sign({
            uid: user.uid,

            username: user.username,

            role: user.role.rolename
        },

        process.env.JWT_SECRET,

        {
            expiresIn: process.env.JWT_EXPIRES_IN || "1d"
        }
    );


    // =========================
    // 5. Trả kết quả Login
    // =========================

    return {
        accessToken: token,

        user: {
            uid: user.uid,

            username: user.username,

            fullname: user.fullname,

            role: user.role.rolename,

            membership: user.membership.mname,

            score: user.membership.score
        }
    };
}