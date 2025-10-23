import { prisma } from './prisma';

async function mergeDuplicateCars() {
    const duplicates = await prisma.car.groupBy({
        by: ['ownerId', 'name', 'imageUrl', 'lineId'],
        _count: { id: true },
        _sum: { count: true },
        having: {
            id: {
                _count: {
                    gt: 1
                }
            }
        }
    });

    for (const dup of duplicates) {
        const { ownerId, name, imageUrl, lineId } = dup;

        const all = await prisma.car.findMany({
            where: { ownerId, name, imageUrl, lineId }
        });

        const totalCount = all.reduce((sum, car) => sum + car.count, 0);
        const latestPrice = all[all.length - 1].price;

        await prisma.car.deleteMany({
            where: { ownerId, name, imageUrl, lineId }
        });

        await prisma.car.create({
            data: {
                ownerId,
                name,
                imageUrl,
                lineId,
                count: totalCount,
                price: latestPrice
            }
        });

        // console.log(`✅ رکوردهای تکراری برای ${name} ادغام شدند.`);
    }

    // console.log('🎯 پاک‌سازی رکوردهای تکراری کامل شد.');
}

mergeDuplicateCars().catch();
