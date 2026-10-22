import "dotenv/config";
import bcrypt from "bcryptjs";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.ts";

// =========================
// Kết nối PostgreSQL
// =========================

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({
    adapter
});

// =========================
// Hàm seed chính
// =========================

async function main() {
    // =========================
    // 1. Seed Role ADMIN
    // =========================

    let adminRole = await prisma.role.findFirst({
        where: {
            rolename: "ADMIN"
        }
    });

    if (!adminRole) {
        adminRole = await prisma.role.create({
            data: {
                rolename: "ADMIN"
            }
        });

        console.log("Created role: ADMIN");
    }


    // =========================
    // 2. Seed Role CUSTOMER
    // Giữ lại để không ảnh hưởng
    // dữ liệu cũ của user oanh
    // =========================

    let customerRole = await prisma.role.findFirst({
        where: {
            rolename: "CUSTOMER"
        }
    });

    if (!customerRole) {
        customerRole = await prisma.role.create({
            data: {
                rolename: "CUSTOMER"
            }
        });

        console.log("Created role: CUSTOMER");
    }


    // =========================
    // 3. Seed Role normal
    // Role mặc định theo bảng chấm
    // =========================

    let normalRole = await prisma.role.findFirst({
        where: {
            rolename: "normal"
        }
    });

    if (!normalRole) {
        normalRole = await prisma.role.create({
            data: {
                rolename: "normal"
            }
        });

        console.log("Created role: normal");
    }


    // =========================
    // 4. Seed Membership BASIC
    // Theo bảng chấm: score = 10
    // =========================

    let basicMembership = await prisma.membership.findFirst({
        where: {
            mname: "BASIC"
        }
    });

    // Nếu BASIC chưa tồn tại
    if (!basicMembership) {
        basicMembership = await prisma.membership.create({
            data: {
                mname: "BASIC",
                score: 10
            }
        });

        console.log("Created membership: BASIC with score 10");
    }

    // Nếu BASIC đã tồn tại nhưng score chưa phải 10
    else if (basicMembership.score !== 10) {
        basicMembership = await prisma.membership.update({
            where: {
                mid: basicMembership.mid
            },
            data: {
                score: 10
            }
        });

        console.log("Updated BASIC score to 10");
    }


    // =========================
    // 5. Kiểm tra cấu hình Admin
    // =========================

    if (!process.env.ADMIN_USERNAME ||
        !process.env.ADMIN_FULLNAME ||
        !process.env.ADMIN_PASSWORD
    ) {
        throw new Error(
            "Missing ADMIN_USERNAME, ADMIN_FULLNAME or ADMIN_PASSWORD in .env"
        );
    }


    // =========================
    // 6. Seed Admin User
    // =========================

    const existingAdmin = await prisma.user.findUnique({
        where: {
            username: process.env.ADMIN_USERNAME
        }
    });

    if (!existingAdmin) {
        const hashedAdminPassword = await bcrypt.hash(
            process.env.ADMIN_PASSWORD,
            10
        );

        await prisma.user.create({
            data: {
                username: process.env.ADMIN_USERNAME,

                fullname: process.env.ADMIN_FULLNAME,

                password: hashedAdminPassword,

                // Role ADMIN
                roleid: adminRole.roleid,

                // Membership BASIC
                mid: basicMembership.mid
            }
        });

        console.log(
            `Created admin user: ${process.env.ADMIN_USERNAME}`
        );
    } else {
        console.log(
            `Admin user already exists: ${process.env.ADMIN_USERNAME}`
        );
    }


    // =========================
    // Hoàn thành
    // =========================

    console.log("Seed completed successfully");
}


// =========================
// Chạy seed
// =========================

main()
    .catch((error) => {
        console.error("Seed failed:");
        console.error(error);

        process.exit(1);
    })
    .finally(async() => {
        await prisma.$disconnect();
    });