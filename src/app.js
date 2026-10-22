import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import prisma from "./config/prisma.js";
import authRoutes from "./routes/auth.routes.js";
import { authenticateToken } from "./middlewares/auth.middleware.js";
import { authorizeRoles } from "./middlewares/role.middleware.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import shipmentRoutes from "./routes/shipment.routes.js";

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/shipments", shipmentRoutes);

app.get("/api/protected", authenticateToken, (req, res) => {
    res.status(200).json({
        message: "Protected route accessed successfully",
        user: req.user
    });
});
app.get(
    "/api/admin-test",
    authenticateToken,
    authorizeRoles("ADMIN"),
    (req, res) => {
        res.status(200).json({
            message: "Admin access granted",
            user: req.user
        });
    }
);
// Route mặc định
app.get("/", (req, res) => {
    res.status(200).json({
        message: "E-commerce MVP API is running"
    });
});

// Health Check
app.get("/health", async(req, res) => {
    try {
        await prisma.$queryRaw `SELECT 1`;

        res.status(200).json({
            status: "UP",
            database: "UP"
        });
    } catch (error) {
        console.error("Health check failed:", error);

        res.status(503).json({
            status: "DOWN",
            database: "DOWN"
        });
    }
});

export default app;