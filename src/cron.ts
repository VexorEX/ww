import cron from 'node-cron';
import { prisma } from './prisma';

// 🚗 تحویل روزانه خودروها از خطوط تولید
export async function deliverDailyCars() {
    const lines = await prisma.productionLine.findMany();

    for (const line of lines) {
        const cars = Array.from({ length: line.dailyLimit }).map(() => ({
            ownerId: line.ownerId,
            name: line.name,
            imageUrl: line.imageUrl,
            price: Math.floor(Math.random() * (18_000_000 - 10_000_000 + 1)) + 10_000_000
        }));

        await prisma.car.createMany({ data: cars });
    }

    console.log(`✅ ${lines.length} خط تولید پردازش شد و خودروها تحویل داده شدند.`);
}

// ⏰ اجرای خودکار رأس 00:00 هر روز
// cron.schedule('0 0 * * *', async () => {
//     try {
//         await deliverDailyCars();
//     } catch (err) {
//         console.error('❌ خطا در تحویل روزانه خودروها:', err);
//     }
// });
