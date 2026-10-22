import {
    registerUser,
    loginUser
} from "../services/auth.service.js";

export async function register(req, res) {
    try {
        const {
            username,
            fullname,
            password
        } = req.body;

        if (!username || !fullname || !password) {
            return res.status(400).json({
                message: "username, fullname and password are required"
            });
        }

        const user = await registerUser(
            username,
            fullname,
            password
        );

        return res.status(201).json({
            message: "Register successfully",
            data: user
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error"
        });
    }
}

export async function login(req, res) {
    try {
        const {
            username,
            password
        } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: "username and password are required"
            });
        }

        const result = await loginUser(
            username,
            password
        );

        return res.status(200).json({
            message: "Login successfully",
            data: result
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error"
        });
    }
}