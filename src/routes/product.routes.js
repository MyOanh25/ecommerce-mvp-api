import express from "express";

import {
    getProducts,
    getProduct,
    create,
    update,
    remove
} from "../controllers/product.controller.js";

import {
    authenticateToken
} from "../middlewares/auth.middleware.js";

import {
    authorizeRoles
} from "../middlewares/role.middleware.js";

const router = express.Router();

// Public
router.get("/", getProducts);

router.get("/:id", getProduct);

// ADMIN only
router.post(
    "/",
    authenticateToken,
    authorizeRoles("ADMIN"),
    create
);

router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("ADMIN"),
    update
);

router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("ADMIN"),
    remove
);

export default router;