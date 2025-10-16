import cron from 'node-cron';
import { prisma } from './prisma';
import { Telegraf } from 'telegraf';
import config from './config/config.json';
import { runDailyTasks } from "./modules/helper/runDailyTasks";

const bot = new Telegraf(config.token);

// 📩 ارسال پیام گزارش به کاربران
async function notifyUsersDaily() {
    const users = await prisma.user.findMany({ select: { userid: true } });

    for (const user of users) {
        try {
            await bot.telegram.sendMessage(
                user.userid.toString(),
                '📅 روز جدید آغاز شد!\n✅ خودروها تحویل داده شدند.\n🔄 محدودیت ساخت‌وساز ریست شد.'
            );
        } catch (err) {
            console.error(`❌ ارسال پیام به کاربر ${user.userid} ناموفق بود.`);
        }
    }
}

// 📢 ارسال پیام به کانال عمومی
async function notifyChannelDaily() {
    const channelId = config.channels.updates; // مثلاً "@my_channel"
    try {
        await bot.telegram.sendMessage(channelId, '📢 روز جدید آغاز شد!');
    } catch (err) {
        console.error('❌ ارسال پیام به کانال ناموفق بود.');
    }
}

export async function deliverDailyCars() {
    const lines = await prisma.productionLine.findMany();
    const userStats: Record<string, { count: number; total: number }> = {};

    for (const line of lines) {
        const cars = Array.from({ length: line.dailyLimit }).map(() => {
            const price = Math.floor(Math.random() * (18_000_000 - 10_000_000 + 1)) + 10_000_000;
            const ownerId = line.ownerId.toString();

            if (!userStats[ownerId]) {
                userStats[ownerId] = { count: 0, total: 0 };
            }

            userStats[ownerId].count += 1;
            userStats[ownerId].total += price;

            return {
                ownerId: line.ownerId,
                name: line.name,
                imageUrl: line.imageUrl,
                price
            };
        });

        await prisma.car.createMany({ data: cars });
    }

    console.log(`✅ ${lines.length} خط تولید پردازش شد و خودروها تحویل داده شدند.`);

    // ارسال پیام به کاربران
    for (const [userId, stats] of Object.entries(userStats)) {
        try {
            const message =
                `🚗 *تحویل روزانه خودروها*\n\n` +
                `📦 تعداد خودرو: *${stats.count.toLocaleString()}*\n` +
                `💰 مجموع ارزش: *${stats.total.toLocaleString()} ریال*\n\n` +
                `🎉 خودروها به انبار شما اضافه شدند.`;

            await bot.telegram.sendMessage(userId, message, { parse_mode: 'Markdown' });
        } catch (err) {
            console.warn(`❌ ارسال پیام به کاربر ${userId} ناموفق بود.`);
        }
    }
}

export async function deliverDailyProfit(bot: Telegraf) {
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

        try {
            await bot.telegram.sendMessage(
                user.userid.toString(),
                `💰 *سود روزانه واریز شد*\n\n➕ مبلغ *${profit.toLocaleString()} ریال* به حساب شما اضافه شد.`,
                { parse_mode: 'Markdown' }
            );
        } catch (err) {
            console.warn(`❌ ارسال پیام سود به کاربر ${user.userid} ناموفق بود.`);
        }
    }

    console.log(`✅ سود روزانه برای ${users.length} کاربر واریز شد.`);
}

// 🕛 اجرای همه وظایف رأس ساعت ۰۰:۰۰
cron.schedule('0 0 * * *', async () => {
    console.log('🚀 شروع وظایف روزانه...');
    await runDailyTasks(false);
    await deliverDailyCars();
    await deliverDailyProfit(bot);
    await notifyUsersDaily();
    await notifyChannelDaily();
    console.log('✅ همه وظایف روزانه با موفقیت انجام شدند.');
});