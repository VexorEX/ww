import config from '../config/config.json'
import { Telegraf } from 'telegraf';
import type { CustomContext } from '../middlewares/userAuth';

const adminIds = config.manage.error.admin;


export default async function notifyAdmins(bot: Telegraf<CustomContext>, message: string) {

    for (const adminId of adminIds) {
        await bot.telegram.sendMessage(adminId, `⚠️ خطا در بات:\n${message}`);
    }
}
