import { Telegraf, session, Markup } from 'telegraf';
import userAuth from './middlewares/userAuth';
import economy from './modules/economy';
import military from './modules/military';
import type { CustomContext } from './middlewares/userAuth';
import countryFilter from "./modules/countryFilter";
import registration from "./modules/registeration";
import config from './config/config.json'
import adminPanel from "./modules/adminPanel";
import notifyAdmins from "./utils/notifyAdmins";
const bot = new Telegraf<CustomContext>(config.token);

bot.use(session()); // برای ctx.state و session
bot.use(userAuth); // uncomment: برای ctx.user
bot.use(economy.middleware());
bot.use(military.middleware());
bot.use(countryFilter); // Composer نه middleware
bot.use(registration); // برای /start و action ها - Composer نه middleware
bot.use(adminPanel);

bot.catch(async (err: unknown, ctx) => {
    const update = ctx.update as any;

    const errorText = [
        `❌ خطا در اکشن: ${ctx.updateType}`,
        `👤 کاربر: ${ctx.from?.id} - ${ctx.from?.username || 'بدون نام کاربری'}`,
        `📄 پیام: ${update?.message?.text || update?.callback_query?.data || 'نامشخص'}`,
        `🧠 خطا: ${(err as Error)?.message || (err as any)?.toString?.() || String(err)}`
    ].join('\n');

    try {
        await ctx.reply('❌ مشکلی پیش آمده. تیم فنی مطلع شد.');
    } catch (_) {}

    try {
        await notifyAdmins(bot, errorText);
    } catch (e) {
        console.error('❌ ارسال پیام به ادمین ناموفق بود:', e);
    }
});


bot.launch();
console.log('بات راه‌اندازی شد!');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
process.on('uncaughtException', async (err) => {
    console.error('❌ uncaughtException:', err);
    await notifyAdmins(bot, `⛔️ خطای سیستمی:\n${err.message || err.toString()}`);
});
process.on('unhandledRejection', async (reason) => {
    console.error('❌ unhandledRejection:', reason);
    await notifyAdmins(bot, `⛔️ رد نشده:\n${reason}`);
});

// registration.action('rank3', async (ctx) => {
//     const adminId = ctx.from.id;
//     console.log(ctx.session);
//     const requestUserId = ctx.session?.requestUserId;
//     console.log(requestUserId);
//
//     if (!ADMIN_RESOURCE_IDS.includes(adminId)) return ctx.answerCbQuery('❌ دسترسی ندارید!');
//     if (!requestUserId) return ctx.answerCbQuery('❌ کاربر درخواست پیدا نشد!');
//
//     const allRanked = getCountriesByRank(3); // خروجی: Country[]
//     const availableNames = getAvailableCountries();
//
//     const filtered = allRanked.filter(c => !availableNames.includes(c.name));
//     if (filtered.length === 0) return ctx.answerCbQuery('❌ همه‌ی کشورها قبلاً تخصیص داده شده‌اند!');
//
//     const keyboard = Markup.inlineKeyboard(
//         filtered.map(c => {
//             const regionData = getCountriesByRegion(c.region as 'asia' | 'europe' | 'africa' | 'america' | 'australia'); // خروجی: Record<key, Country>
//             const key = Object.entries(regionData).find(([_, val]) => val.name === c.name)?.[0];
//             return [Markup.button.callback(c.name, `setCountry_${requestUserId}_${key}`)];
//         })
//     );
//
//     await ctx.reply('🌍 کشورهای آزاد با رتبه ۳:', keyboard);
//     ctx.answerCbQuery();
// });
// registration.action('rank2', async (ctx) => {
//     const adminId = ctx.from.id;
//     const requestUserId = ctx.session?.requestUserId;
//
//     if (!ADMIN_RESOURCE_IDS.includes(adminId)) return ctx.answerCbQuery('❌ دسترسی ندارید!');
//     if (!requestUserId) return ctx.answerCbQuery('❌ کاربر درخواست پیدا نشد!');
//
//     const allRanked = getCountriesByRank(2); // خروجی: Country[]
//     const availableNames = getAvailableCountries();
//
//     const filtered = allRanked.filter(c => !availableNames.includes(c.name));
//     if (filtered.length === 0) return ctx.answerCbQuery('❌ همه‌ی کشورها قبلاً تخصیص داده شده‌اند!');
//
//     const keyboard = Markup.inlineKeyboard(
//         filtered.map(c => {
//             const regionData = getCountriesByRegion(c.region as 'asia' | 'europe' | 'africa' | 'america' | 'australia'); // خروجی: Record<key, Country>
//             const key = Object.entries(regionData).find(([_, val]) => val.name === c.name)?.[0];
//             return [Markup.button.callback(c.name, `setCountry_${requestUserId}_${key}`)];
//         })
//     );
//
//     await ctx.reply('🌍 کشورهای آزاد با رتبه ۳:', keyboard);
//     ctx.answerCbQuery();
// });
// registration.action('rank1', async (ctx) => {
//     const adminId = ctx.from.id;
//     const requestUserId = ctx.session?.requestUserId;
//
//     if (!ADMIN_RESOURCE_IDS.includes(adminId)) return ctx.answerCbQuery('❌ دسترسی ندارید!');
//     if (!requestUserId) return ctx.answerCbQuery('❌ کاربر درخواست پیدا نشد!');
//
//     const allRanked = getCountriesByRank(1); // خروجی: Country[]
//     const availableNames = getAvailableCountries();
//
//     const filtered = allRanked.filter(c => !availableNames.includes(c.name));
//     if (filtered.length === 0) return ctx.answerCbQuery('❌ همه‌ی کشورها قبلاً تخصیص داده شده‌اند!');
//
//     const keyboard = Markup.inlineKeyboard(
//         filtered.map(c => {
//             const regionData = getCountriesByRegion(c.region as 'asia' | 'europe' | 'africa' | 'america' | 'australia'); // خروجی: Record<key, Country>
//             const key = Object.entries(regionData).find(([_, val]) => val.name === c.name)?.[0];
//             if (!key) return null;
//             return [Markup.button.callback(c.name, `setCountry_${requestUserId}_${key}`)];
//         })
//     );
//
//     await ctx.reply('🌍 کشورهای آزاد با رتبه ۳:', keyboard);
//     ctx.answerCbQuery();
// });
// registration.action('rank0', async (ctx) => {
//     const adminId = ctx.from.id;
//     const requestUserId = ctx.session?.requestUserId;
//
//     if (!ADMIN_RESOURCE_IDS.includes(adminId)) return ctx.answerCbQuery('❌ دسترسی ندارید!');
//     if (!requestUserId) return ctx.answerCbQuery('❌ کاربر درخواست پیدا نشد!');
//
//     const allRanked = getCountriesByRank(0); // خروجی: Country[]
//     const availableNames = getAvailableCountries();
//
//     const filtered = allRanked.filter(c => !availableNames.includes(c.name));
//     if (filtered.length === 0) return ctx.answerCbQuery('❌ همه‌ی کشورها قبلاً تخصیص داده شده‌اند!');
//
//     const keyboard = Markup.inlineKeyboard(
//         filtered.map(c => {
//             const regionData = getCountriesByRegion(c.region as 'asia' | 'europe' | 'africa' | 'america' | 'australia'); // خروجی: Record<key, Country>
//             const key = Object.entries(regionData).find(([_, val]) => val.name === c.name)?.[0];
//             return [Markup.button.callback(c.name, `setCountry_${requestUserId}_${key}`)];
//         })
//     );
//
//     await ctx.reply('🌍 کشورهای آزاد با رتبه ۳:', keyboard);
//     ctx.answerCbQuery();
// });
