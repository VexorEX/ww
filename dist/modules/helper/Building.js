"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductionLine = createProductionLine;
const prisma_1 = require("../../prisma");
async function createProductionLine(input) {
    const { ownerId, setupCost } = input;
    const user = await prisma_1.prisma.user.findUnique({ where: { userid: ownerId } });
    if (!user || user.capital < setupCost) {
        return { error: '❌ بودجه کافی ندارید.' };
    }
    await prisma_1.prisma.user.update({
        where: { userid: ownerId },
        data: { capital: { decrement: setupCost } }
    });
    const line = await prisma_1.prisma.productionLine.create({
        data: {
            ownerId: input.ownerId,
            country: input.country,
            name: input.name,
            type: input.type,
            imageUrl: input.imageUrl,
            dailyLimit: input.dailyLimit,
            setupCost: input.setupCost
        }
    });
    return { success: true, line };
}
