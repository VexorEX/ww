import { prisma } from './prisma';

async function fixDuplicateCars() {
    const duplicates = await prisma.car.groupBy({
        by: ['ownerId', 'name', 'imageUrl', 'lineId'],
        _count: { id: true },
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

        // console.log(`✅ ${name} merged (${totalCount} units).`);
    }

    // console.log('🎯 All duplicates resolved.');
}

fixDuplicateCars()
    .then(() => console.log('🎯 پاک‌سازی رکوردهای تکراری کامل شد.'))
    .catch((err) => console.error('❌ خطا در اجرای اسکریپت:', err));
