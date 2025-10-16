import { prisma } from '../../prisma';
import { Telegraf } from 'telegraf';
import config from '../../config/config.json';
import { deliverDailyCars,deliverDailyProfit } from '../../cron';
import fs from 'fs';
import path from 'path';

const bot = new Telegraf(config.token);
const statePath = path.join(__dirname, './.dailyState.json');

function getTodayDate(): string {
    return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
}

function getLastRunDate(): string | null {
    try {
        const data = fs.readFileSync(statePath, 'utf-8');
        const parsed = JSON.parse(data);
        return parsed.lastRunDate || null;
    } catch {
        return null;
    }
}

function setLastRunDate(date: string) {
    fs.writeFileSync(statePath, JSON.stringify({ lastRunDate: date }), 'utf-8');
}

export async function runDailyTasks(manualTrigger = false): Promise<string> {
    const today = getTodayDate();
    const lastRun = getLastRunDate();

    if (!manualTrigger && lastRun === today) {
        console.log('⏸ وظایف روزانه قبلاً امروز اجرا شده‌اند.');
        return '⏸ امروز قبلاً اجرا شده.';
    }

    console.log('🚀 شروع وظایف روزانه...');
    await deliverDailyCars();
    await deliverDailyProfit(bot);

    // پیام به کاربران
    const users = await prisma.user.findMany({ select: { userid: true } });
    for (const user of users) {
        try {
            await bot.telegram.sendMessage(
                user.userid.toString(),
                '📅 روز جدید آغاز شد!\n✅ خودروها تحویل داده شدند.\n💰 سود روزانه واریز شد.\n🔄 محدودیت ساخت‌وساز ریست شد.'
            );
        } catch (err) {
            console.warn(`❌ ارسال پیام به کاربر ${user.userid} ناموفق بود.`);
        }
    }

    // پیام به کانال
    try {
        await bot.telegram.sendMessage(config.channels.updates, '📢 روز جدید آغاز شد! همه چیز ریست شد.');
    } catch (err) {
        console.warn('❌ ارسال پیام به کانال ناموفق بود.');
    }

    setLastRunDate(today);
    return '✅ وظایف روزانه با موفقیت اجرا شدند.';
}