import { deliverDailyCars,deliverDailyProfit,notifyUsersCombined,notifyChannelDaily } from '../../cron';
import fs from 'fs';
import path from 'path';

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
    await deliverDailyProfit();
    await notifyUsersCombined();      // پیام ترکیبی به کاربران
    await notifyChannelDaily();      // پیام عمومی به کانال

    setLastRunDate(today);
    return '✅ وظایف روزانه با موفقیت اجرا شدند.';
}