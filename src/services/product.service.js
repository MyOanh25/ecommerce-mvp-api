import prisma from "../config/prisma.js";

// =========================
// Lấy tất cả sản phẩm
// =========================

export async function getAllProducts() {
    return await prisma.product.findMany({
        orderBy: {
            pid: "asc"
        }
    });
}

// =========================
// Lấy sản phẩm theo ID
// =========================

export async function getProductById(pid) {
    const product = await prisma.product.findUnique({
        where: {
            pid
        }
    });

    if (!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
    }

    return product;
}

// =========================
// Tạo sản phẩm
// =========================

export async function createProduct(pname, price, quantity) {
    return await prisma.product.create({
        data: {
            pname,
            price: String(price),
            quantity
        }
    });
}

// =========================
// Cập nhật sản phẩm
// =========================

export async function updateProduct(
    pid,
    pname,
    price,
    quantity
) {
    const existingProduct = await prisma.product.findUnique({
        where: {
            pid
        }
    });

    if (!existingProduct) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
    }

    return await prisma.product.update({
        where: {
            pid
        },
        data: {
            pname,
            price: String(price),
            quantity
        }
    });
}

// =========================
// Xóa sản phẩm
// =========================

export async function deleteProduct(pid) {
    const existingProduct = await prisma.product.findUnique({
        where: {
            pid
        }
    });

    if (!existingProduct) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
    }

    return await prisma.product.delete({
        where: {
            pid
        }
    });
}