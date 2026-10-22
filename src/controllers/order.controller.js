import {
    createOrder,
    getOrdersByUser,
    getOrderById
} from "../services/order.service.js";


// =========================
// POST /api/orders
// =========================

export async function create(req, res) {
    try {
        const uid = req.user.uid;

        const {
            items
        } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "items must be a non-empty array"
            });
        }

        // -------------------------
        // Kiểm tra từng item
        // -------------------------

        for (const item of items) {
            if (!Number.isInteger(Number(item.pid)) ||
                Number(item.pid) <= 0 ||
                !Number.isInteger(Number(item.qty)) ||
                Number(item.qty) <= 0
            ) {
                return res.status(400).json({
                    message: "pid and qty must be positive integers"
                });
            }
        }

        // -------------------------
        // Không cho trùng Product
        // -------------------------

        const productIds = items.map(
            (item) => Number(item.pid)
        );

        const uniqueProductIds = new Set(productIds);

        if (uniqueProductIds.size !== productIds.length) {
            return res.status(400).json({
                message: "Duplicate products are not allowed"
            });
        }

        const normalizedItems = items.map((item) => ({
            pid: Number(item.pid),
            qty: Number(item.qty)
        }));

        const order = await createOrder(
            uid,
            normalizedItems
        );

        return res.status(201).json({
            message: "Create order successfully",
            data: order
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error"
        });
    }
}


// =========================
// GET /api/orders
// =========================

export async function getOrders(req, res) {
    try {
        const uid = req.user.uid;

        const orders = await getOrdersByUser(uid);

        return res.status(200).json({
            message: "Get orders successfully",
            data: orders
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error"
        });
    }
}


// =========================
// GET /api/orders/:id
// =========================

export async function getOrder(req, res) {
    try {
        const oid = Number(req.params.id);

        if (!Number.isInteger(oid) || oid <= 0) {
            return res.status(400).json({
                message: "Invalid order id"
            });
        }

        const uid = req.user.uid;

        const order = await getOrderById(
            oid,
            uid
        );

        return res.status(200).json({
            message: "Get order successfully",
            data: order
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error"
        });
    }
}