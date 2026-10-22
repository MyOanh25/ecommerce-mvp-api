import prisma from "../config/prisma.js";

// =========================
// Tạo đơn hàng
// =========================

export async function createOrder(uid, items) {
    return await prisma.$transaction(async(tx) => {
        // -------------------------
        // 1. Tạo Order
        // -------------------------

        const order = await tx.order.create({
            data: {
                uid
            }
        });

        // -------------------------
        // 2. Xử lý từng sản phẩm
        // -------------------------

        for (const item of items) {
            const product = await tx.product.findUnique({
                where: {
                    pid: item.pid
                }
            });

            if (!product) {
                const error = new Error(
                    `Product ${item.pid} not found`
                );

                error.statusCode = 404;
                throw error;
            }

            // -------------------------
            // Kiểm tra và trừ tồn kho
            // -------------------------

            const stockUpdated = await tx.product.updateMany({
                where: {
                    pid: item.pid,
                    quantity: {
                        gte: item.qty
                    }
                },
                data: {
                    quantity: {
                        decrement: item.qty
                    }
                }
            });

            if (stockUpdated.count === 0) {
                const error = new Error(
                    `Insufficient stock for product ${item.pid}`
                );

                error.statusCode = 409;
                throw error;
            }

            // -------------------------
            // Tạo OrderDetail
            // -------------------------

            await tx.orderDetail.create({
                data: {
                    oid: order.oid,
                    pid: item.pid,
                    qty: item.qty,

                    // Giá tại thời điểm đặt hàng
                    unitPrice: product.price
                }
            });
        }

        // -------------------------
        // 3. Trả Order đầy đủ
        // -------------------------

        return await tx.order.findUnique({
            where: {
                oid: order.oid
            },
            include: {
                orderDetails: {
                    include: {
                        product: true
                    }
                }
            }
        });
    });
}


// =========================
// Lấy các đơn của User hiện tại
// =========================

export async function getOrdersByUser(uid) {
    return await prisma.order.findMany({
        where: {
            uid
        },
        include: {
            orderDetails: {
                include: {
                    product: true
                }
            },
            shipments: true
        },
        orderBy: {
            oid: "desc"
        }
    });
}


// =========================
// Lấy một Order của User
// =========================

export async function getOrderById(oid, uid) {
    const order = await prisma.order.findFirst({
        where: {
            oid,
            uid
        },
        include: {
            orderDetails: {
                include: {
                    product: true
                }
            },
            shipments: true
        }
    });

    if (!order) {
        const error = new Error("Order not found");
        error.statusCode = 404;

        throw error;
    }

    return order;
}