import commands from './admin/commands';
import editAsset from './admin/editAssets';
import type { CustomContext } from '../middlewares/userAuth';
import {Composer, Markup} from "telegraf";
import config from '../config/config.json'
import showUser from "./admin/showUser";
import toggleMenu from "./admin/toggleMenu";
import { runDailyTasks } from "./helper/runDailyTasks";
import lottery from "./admin/lottery";
import countryManagement from "./countryManagement";
import { applyDailyMineProfitForAllUsers } from "./components/mines";


const adminPanel = new Composer<CustomContext>();

const adminPanelKeyboard = Markup.inlineKeyboard([
    [Markup.button.callback('✏️ ویرایش دارایی', 'admin_editAsset'), Markup.button.callback('🛠 ویرایش گروهی دارایی‌ها', 'admin_editAssetAll')],
    [Markup.button.callback('🌐 سازمان ملل', 'admin_un')],
    [Markup.button.callback('📰 روزنامه', 'admin_news'), Markup.button.callback('📢 اعلان‌ها', 'admin_announcements')],
    [Markup.button.callback('📊 آمار جهانی', 'admin_globalStats'), Markup.button.callback('⛏ آمار منابع', 'admin_resourceStats'), Markup.button.callback('📋 آمار عمومی', 'admin_publicStats')],
    [Markup.button.callback('📣 پیام همگانی', 'admin_broadcast'),Markup.button.callback('🌪 بلای طبیعی', 'admin_disaster')],
    [Markup.button.callback('─────────────', 'noop')],
    [Markup.button.callback('🎁 ارسال جایزه روزانه', 'admin_dailyReward') ,Markup.button.callback('🧩 مدیریت منو','admin_toggleMenu')],
    [Markup.button.callback('🎟️ مدیریت لاتاری', 'admin_lottery')],
    [Markup.button.callback('💸 واریز منابع معادن', 'deposit_mines_action')],
    [Markup.button.callback('🔙 بازگشت', 'admin_back'), Markup.button.callback('❌ بستن', 'admin_close')],
]);

adminPanel.command('panel', async (ctx) => {
    if (!config.manage.admins.includes(ctx.from.id)) return ctx.reply('⛔ شما ادمین نیستید.');

    await ctx.reply('🎛 پنل مدیریت:', adminPanelKeyboard);
});

adminPanel.use(commands)
adminPanel.use(editAsset)
adminPanel.use(showUser)
adminPanel.use(toggleMenu)
adminPanel.use(lottery)

adminPanel.command('deposit_mines', async (ctx) => {
    const adminId = ctx.from.id;
    const admins = config.manage.buildings?.mines?.admins || [];
    if (!admins.includes(adminId)) {
        return ctx.reply('⛔ فقط ادمین‌های معادن می‌تونن این کار رو انجام بدن.');
    }

    await ctx.reply('⏳ در حال واریز منابع معادن برای همه کاربران...');
    try {
        const result = await applyDailyMineProfitForAllUsers();
        if (result === 'ok') {
            await ctx.reply('✅ واریز منابع معادن برای همه کاربران با موفقیت انجام شد.');
        } else {
            await ctx.reply('❌ در واریز منابع خطایی رخ داد. لاگ‌ها را بررسی کن.');
        }
    } catch (err) {
        console.error('❌ خطا در deposit_mines command:', err);
        await ctx.reply('❌ خطا در اجرای واریز منابع. جزئیات در لاگ ثبت شد.');
    }
});
adminPanel.action('deposit_mines_action', async (ctx) => {
    const adminId = ctx.from.id;
    const admins = config.manage.buildings?.mines?.admins || [];
    if (!admins.includes(adminId)) {
        await ctx.answerCbQuery('⛔ شما دسترسی ندارید.');
        return;
    }

    await ctx.answerCbQuery('⏳ در حال واریز منابع معادن...');
    try {
        const result = await applyDailyMineProfitForAllUsers();
        if (result === 'ok') {
            await ctx.reply('✅ واریز منابع معادن برای همه کاربران با موفقیت انجام شد.');
        } else {
            await ctx.reply('❌ در واریز منابع خطایی رخ داد. لاگ‌ها را بررسی کن.');
        }
    } catch (err) {
        console.error('❌ خطا در deposit_mines_action:', err);
        await ctx.reply('❌ خطا در اجرای واریز منابع. جزئیات در لاگ ثبت شد.');
    }
});


adminPanel.action('admin_panel_return', async (ctx) => {
    const adminId = ctx.from.id;
    if (!config.manage.admins.includes(adminId)) {
        return ctx.reply('⛔ شما ادمین نیستید.');
    }

    await ctx.editMessageText('🎛 پنل مدیریت:', adminPanelKeyboard);
});
adminPanel.action('admin_dailyReward', async (ctx) => {
    const adminId = ctx.from.id;
    if (!config.manage.admins.includes(adminId)) {
        return ctx.reply('⛔ فقط ادمین‌ها می‌تونن این عملیات رو اجرا کنن.');
    }

    await ctx.reply('⏳ در حال اجرای وظایف روزانه...');
    const result = await runDailyTasks(true);
    await ctx.reply(result);
    ctx.answerCbQuery();
});
adminPanel.action('admin_back', async (ctx) => {
    const adminId = ctx.from.id;
    if (!config.manage.admins.includes(adminId)) {
        return ctx.answerCbQuery('⛔ شما ادمین نیستید.');
    }

    // Return to admin panel by triggering the panel command
    await ctx.editMessageText('🎛 پنل مدیریت:', adminPanelKeyboard);
});

export default adminPanel;
