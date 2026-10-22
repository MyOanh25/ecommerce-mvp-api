import express from "express";

import {
    create,
    getOrders,
    getOrder
} from "../controllers/order.controller.js";

import {
    authenticateToken
} from "../middlewares/auth.middleware.js";

const router = express.Router();


// Tất cả Order API đều cần đăng nhập
router.use(authenticateToken);


// Tạo đơn hàng
router.post("/", create);


// Xem các đơn của chính User
router.get("/", getOrders);


// Xem một đơn của chính User
router.get("/:id", getOrder);


export default router;