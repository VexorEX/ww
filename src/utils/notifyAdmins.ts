import { Composer } from "telegraf";
import config from '../config/config.json';
import { CustomContext } from "../middlewares/userAuth";

const ADMINS = config.manage.error.admin

export default async function notifyAdmins(bot: Composer<CustomContext>, message: string) {
    for (const adminId of ADMINS) {
        try {
            await bot.telegram.sendMessage(adminId, `⚠️ خطا در بات:\n${message}`);
        } catch (err) {
            console.error(`❌ ارسال پیام به ادمین ${adminId} ناموفق بود:`, err);
        }
    }
}
