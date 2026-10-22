import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "../services/product.service.js";

// =========================
// GET /api/products
// =========================

export async function getProducts(req, res) {
    try {
        const products = await getAllProducts();

        return res.status(200).json({
            message: "Get products successfully",
            data: products
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error"
        });
    }
}

// =========================
// GET /api/products/:id
// =========================

export async function getProduct(req, res) {
    try {
        const pid = Number(req.params.id);

        if (!Number.isInteger(pid) || pid <= 0) {
            return res.status(400).json({
                message: "Invalid product id"
            });
        }

        const product = await getProductById(pid);

        return res.status(200).json({
            message: "Get product successfully",
            data: product
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error"
        });
    }
}

// =========================
// POST /api/products
// =========================

export async function create(req, res) {
    try {
        const {
            pname,
            price,
            quantity
        } = req.body;

        if (!pname ||
            price === undefined ||
            quantity === undefined
        ) {
            return res.status(400).json({
                message: "pname, price and quantity are required"
            });
        }

        if (
            Number(price) < 0 ||
            !Number.isInteger(Number(quantity)) ||
            Number(quantity) < 0
        ) {
            return res.status(400).json({
                message: "price and quantity must be valid non-negative values"
            });
        }

        const product = await createProduct(
            pname,
            price,
            Number(quantity)
        );

        return res.status(201).json({
            message: "Create product successfully",
            data: product
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error"
        });
    }
}

// =========================
// PUT /api/products/:id
// =========================

export async function update(req, res) {
    try {
        const pid = Number(req.params.id);

        if (!Number.isInteger(pid) || pid <= 0) {
            return res.status(400).json({
                message: "Invalid product id"
            });
        }

        const {
            pname,
            price,
            quantity
        } = req.body;

        if (!pname ||
            price === undefined ||
            quantity === undefined
        ) {
            return res.status(400).json({
                message: "pname, price and quantity are required"
            });
        }

        if (
            Number(price) < 0 ||
            !Number.isInteger(Number(quantity)) ||
            Number(quantity) < 0
        ) {
            return res.status(400).json({
                message: "price and quantity must be valid non-negative values"
            });
        }

        const product = await updateProduct(
            pid,
            pname,
            price,
            Number(quantity)
        );

        return res.status(200).json({
            message: "Update product successfully",
            data: product
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error"
        });
    }
}

// =========================
// DELETE /api/products/:id
// =========================

export async function remove(req, res) {
    try {
        const pid = Number(req.params.id);

        if (!Number.isInteger(pid) || pid <= 0) {
            return res.status(400).json({
                message: "Invalid product id"
            });
        }

        const product = await deleteProduct(pid);

        return res.status(200).json({
            message: "Delete product successfully",
            data: product
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error"
        });
    }
}