import cron from 'node-cron';
import { prisma } from './prisma';
import { Telegraf } from 'telegraf';
import config from './config/config.json';
import { runDailyTasks } from './modules/helper/runDailyTasks';
import { applyDailyMineProfitForAllUsers } from './modules/components/mines';
import { expirePendingRequests } from "./modules/helper/expirePendingRequests";

const bot = new Telegraf(config.token);

type UserStats = {
    carCount: number;
    carValue: number;
    profit: number;
};

const userStats: Record<string, UserStats> = {};

// 🚗 تحویل خودروها
export async function deliverDailyCars() {
    const lines = await prisma.productionLine.findMany({ where: { type: 'car' } });

    await prisma.user.updateMany({
        data: {
            lastCarBuildAt: null,
            lastConstructionBuildAt: null
        }
    });

    for (const line of lines) {
        const outputCount = 15;
        const unitPrice = Math.floor(Math.random() * (18_000_000 - 10_000_000 + 1)) + 10_000_000;
        const ownerId = line.ownerId.toString();

        await prisma.car.create({
            data: {
                ownerId: line.ownerId,
                name: line.name,
                imageUrl: line.imageUrl,
                price: unitPrice,
                count: outputCount,
                lineId: line.id
            }
        });

        if (!userStats[ownerId]) {
            userStats[ownerId] = { carCount: 0, carValue: 0, profit: 0 };
        }
        userStats[ownerId].carCount += outputCount;
        userStats[ownerId].carValue += outputCount * unitPrice;

        const updatedLimit = line.dailyLimit - 1;
        if (updatedLimit <= 0) {
            await prisma.productionLine.delete({ where: { id: line.id } });
        } else {
            await prisma.productionLine.update({
                where: { id: line.id },
                data: {
                    unitPrice,
                    dailyOutput: outputCount,
                    dailyLimit: updatedLimit
                }
            });
        }
    }

    console.log(`✅ ${lines.length} خط تولید خودرو پردازش شد.`);
}

// 💰 افزودن سود پروژه‌های عمرانی
export async function deliverDailyProfit() {
    const users = await prisma.user.findMany({ select: { userid: true, dailyProfit: true } });

    for (const user of users) {
        const profit = Number(user.dailyProfit || 0);
        if (profit <= 0) continue;

        await prisma.user.update({
            where: { userid: user.userid },
            data: {
                capital: { increment: profit }
            }
        });

        const uid = user.userid.toString();
        if (!userStats[uid]) {
            userStats[uid] = { carCount: 0, carValue: 0, profit: 0 };
        }
        userStats[uid].profit += profit;
    }

    console.log(`✅ سود روزانه ${users.length} کاربر اعمال شد.`);
}

// 📩 ارسال پیام ترکیبی به کاربران
export async function notifyUsersCombined() {
    for (const [userId, stats] of Object.entries(userStats)) {
        const message =
            `📅 روز جدید آغاز شد!\n\n` +
            `🚗 خودروها تحویل داده شدند: *${stats.carCount.toLocaleString()}* واحد\n` +
            `💰 مجموع ارزش خودروها: *${stats.carValue.toLocaleString()} ریال*\n` +
            `➕ سود پروژه‌های عمرانی: *${stats.profit.toLocaleString()} ریال*\n` +
            `⛏ منابع معادن نیز به حساب شما اضافه شدند.\n\n` +
            `🎉 روز خوبی داشته باشی!`;

        try {
            await bot.telegram.sendMessage(userId, message, { parse_mode: 'Markdown' });
        } catch (err) {
            console.warn(`❌ ارسال پیام به کاربر ${userId} ناموفق بود.`);
        }
    }
}

// 📢 پیام عمومی به کانال
export async function notifyChannelDaily() {
    const channelId = config.channels.updates;
    try {
        await bot.telegram.sendMessage(channelId, '📢 روز جدید آغاز شد!');
    } catch (err) {
        console.error('❌ ارسال پیام به کانال ناموفق بود.');
    }
}

// 🕛 اجرای همه وظایف رأس ساعت ۰۰:۰۰
// cron.schedule('0 0 * * *', async () => {
//     console.log('🚀 شروع وظایف روزانه...');
//     await runDailyTasks(false);
//     await deliverDailyCars();
//     await deliverDailyProfit();
//     await applyDailyMineProfitForAllUsers();
//     await notifyUsersCombined();
//     await notifyChannelDaily();
//     console.log('✅ همه وظایف روزانه با موفقیت انجام شدند.');
// });
cron.schedule('*/5 * * * *', async () => {
    console.log('🚨 بررسی پروژه‌های منقضی‌شده...');
    await expirePendingRequests(bot);
});