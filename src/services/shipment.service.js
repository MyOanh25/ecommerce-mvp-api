import prisma from "../config/prisma.js";

// =========================
// Tạo Shipment
// =========================

export async function createShipment(oid, status) {
    const order = await prisma.order.findUnique({
        where: {
            oid
        }
    });

    if (!order) {
        const error = new Error("Order not found");
        error.statusCode = 404;
        throw error;
    }

    return await prisma.shipment.create({
        data: {
            oid,
            status
        }
    });
}


// =========================
// Lấy Shipment theo Order
// =========================

export async function getShipmentsByOrder(
    oid,
    currentUser
) {
    const order = await prisma.order.findUnique({
        where: {
            oid
        }
    });

    if (!order) {
        const error = new Error("Order not found");
        error.statusCode = 404;
        throw error;
    }

    // CUSTOMER chỉ được xem Order của chính mình
    if (
        currentUser.role !== "ADMIN" &&
        order.uid !== currentUser.uid
    ) {
        const error = new Error("Access denied");
        error.statusCode = 403;
        throw error;
    }

    return await prisma.shipment.findMany({
        where: {
            oid
        },
        orderBy: {
            shipid: "asc"
        }
    });
}


// =========================
// Cập nhật trạng thái Shipment
// =========================

export async function updateShipmentStatus(
    shipid,
    status
) {
    const shipment = await prisma.shipment.findUnique({
        where: {
            shipid
        }
    });

    if (!shipment) {
        const error = new Error("Shipment not found");
        error.statusCode = 404;
        throw error;
    }

    return await prisma.shipment.update({
        where: {
            shipid
        },
        data: {
            status
        }
    });
}