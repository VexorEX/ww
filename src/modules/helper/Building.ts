import { prisma } from "../../prisma";

interface ProductInput {
    ownerId: bigint;
    country: string;
    name: string;
    type: string;
    imageUrl: string;
    dailyLimit: number;
    setupCost: bigint;
    carName: string;
}

export async function createProductionLine(input: ProductInput) {
    const { ownerId, setupCost } = input;

    const user = await prisma.user.findUnique({ where: { userid: ownerId } });
    if (!user || user.capital < setupCost) {
        return { error: '❌ بودجه کافی ندارید.' };
    }

    const line = await prisma.productionLine.create({ 
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
