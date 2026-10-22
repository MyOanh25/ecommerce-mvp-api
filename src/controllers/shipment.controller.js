import {
    createShipment,
    getShipmentsByOrder,
    updateShipmentStatus
} from "../services/shipment.service.js";


// =========================
// POST /api/shipments
// =========================

export async function create(req, res) {
    try {
        const {
            oid,
            status
        } = req.body;

        const orderId = Number(oid);

        if (!Number.isInteger(orderId) ||
            orderId <= 0 ||
            !status ||
            typeof status !== "string"
        ) {
            return res.status(400).json({
                message: "Valid oid and status are required"
            });
        }

        const shipment = await createShipment(
            orderId,
            status.trim()
        );

        return res.status(201).json({
            message: "Create shipment successfully",
            data: shipment
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error"
        });
    }
}


// =========================
// GET /api/shipments/order/:oid
// =========================

export async function getByOrder(req, res) {
    try {
        const oid = Number(req.params.oid);

        if (!Number.isInteger(oid) || oid <= 0) {
            return res.status(400).json({
                message: "Invalid order id"
            });
        }

        const shipments = await getShipmentsByOrder(
            oid,
            req.user
        );

        return res.status(200).json({
            message: "Get shipments successfully",
            data: shipments
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error"
        });
    }
}


// =========================
// PUT /api/shipments/:id/status
// =========================

export async function updateStatus(req, res) {
    try {
        const shipid = Number(req.params.id);

        if (!Number.isInteger(shipid) || shipid <= 0) {
            return res.status(400).json({
                message: "Invalid shipment id"
            });
        }

        const {
            status
        } = req.body;

        if (!status || typeof status !== "string") {
            return res.status(400).json({
                message: "status is required"
            });
        }

        const shipment = await updateShipmentStatus(
            shipid,
            status.trim()
        );

        return res.status(200).json({
            message: "Update shipment status successfully",
            data: shipment
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error"
        });
    }
}