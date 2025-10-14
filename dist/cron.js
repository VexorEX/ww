"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deliverDailyCars = deliverDailyCars;
const prisma_1 = require("./prisma");
async function deliverDailyCars() {
    const lines = await prisma_1.prisma.productionLine.findMany();
    for (const line of lines) {
        const cars = Array.from({ length: line.dailyLimit }).map(() => ({
            ownerId: line.ownerId,
            name: line.name,
            imageUrl: line.imageUrl,
            price: Math.floor(Math.random() * (18000000 - 10000000 + 1)) + 10000000
        }));
        await prisma_1.prisma.car.createMany({ data: cars });
    }
    console.log(`✅ ${lines.length} خط تولید پردازش شد و خودروها تحویل داده شدند.`);
}
