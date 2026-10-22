import express from "express";

import {
    create,
    getByOrder,
    updateStatus
} from "../controllers/shipment.controller.js";

import {
    authenticateToken
} from "../middlewares/auth.middleware.js";

import {
    authorizeRoles
} from "../middlewares/role.middleware.js";

const router = express.Router();


// Tất cả Shipment API đều cần đăng nhập
router.use(authenticateToken);


// ADMIN tạo Shipment
router.post(
    "/",
    authorizeRoles("ADMIN"),
    create
);


// ADMIN hoặc chủ Order được xem
router.get(
    "/order/:oid",
    getByOrder
);


// Chỉ ADMIN cập nhật trạng thái
router.put(
    "/:id/status",
    authorizeRoles("ADMIN"),
    updateStatus
);


export default router;