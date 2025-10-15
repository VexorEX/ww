import commands from './admin/commands';
import features from './admin/features';
import type { CustomContext } from '../middlewares/userAuth';
import {Composer, Markup} from "telegraf";
import config from '../config/config.json'
import showUser from "./admin/showUser";
import toggleMenu from "./admin/toggleMenu";


const adminPanel = new Composer<CustomContext>();

const adminPanelKeyboard = Markup.inlineKeyboard([
    [Markup.button.callback('✏️ ویرایش دارایی', 'admin_editAsset'), Markup.button.callback('🌪 بلای طبیعی', 'admin_disaster')],
    [Markup.button.callback('🌐 سازمان ملل', 'admin_un')],
    [Markup.button.callback('📰 روزنامه', 'admin_news'), Markup.button.callback('📢 اعلان‌ها', 'admin_announcements')],
    [Markup.button.callback('📊 آمار جهانی', 'admin_globalStats'), Markup.button.callback('⛏ آمار منابع', 'admin_resourceStats'), Markup.button.callback('📋 آمار عمومی', 'admin_publicStats')],
    [Markup.button.callback('📣 پیام همگانی', 'admin_broadcast')],
    [Markup.button.callback('─────────────', 'noop')],
    [Markup.button.callback('🎁 ارسال جایزه روزانه', 'admin_dailyReward') ,Markup.button.callback('🧩 مدیریت منو','admin_toggleMenu')],
    [Markup.button.callback('🔙 بازگشت', 'admin_back'), Markup.button.callback('❌ بستن', 'admin_close')],
]);

adminPanel.command('panel', async (ctx) => {
    if (!config.manage.admins.includes(ctx.from.id)) return ctx.reply('⛔ شما ادمین نیستید.');

    await ctx.reply('🎛 پنل مدیریت:', adminPanelKeyboard);
});

adminPanel.use(showUser)
adminPanel.use(toggleMenu)
adminPanel.use(commands)
adminPanel.use(features)

export default adminPanel;