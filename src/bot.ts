import { Telegraf, session, Markup } from 'telegraf';
import userAuth from './middlewares/userAuth';
import economy from './modules/economy';
import military from './modules/military';
import type { CustomContext } from './middlewares/userAuth';
import * as dotenv from 'dotenv';
import countryFilter from "./modules/countryFilter";
import registration from "./modules/registeration";
import userPanel from "./modules/userPanel";
import { prisma } from "./prisma";


dotenv.config(); // اول همه import ها
console.log('BOT_TOKEN loaded:', process.env.BOT_TOKEN ? 'YES' : 'NO'); // security: token رو print نکن
const bot = new Telegraf<CustomContext>("7639208583:AAGI9rCVNrAD-9-fmX5DxEw-FSych-XpgC4", {
    telegram: { apiRoot: "http://46.38.138.55:808/" }
});

// bot.use(async (ctx, next) => {
//     const allowedIds = [7588477963, 5913282749]; // لیست آی‌دی‌های مجاز
//
//     if (!allowedIds.includes(ctx.from?.id)) {
//         if ('message' in ctx && ctx.message) {
//             await ctx.reply('sihtir');
//         }
//         return; // ادامه نده
//     }
//
//     // اگر آی‌دی مجاز بود، ادامه بده
//     await next();
// });

bot.use(session()); // برای ctx.state و session
bot.use(userAuth); // uncomment: برای ctx.user
bot.use(economy.middleware());
bot.use(military.middleware());
bot.use(countryFilter); // Composer نه middleware
bot.use(registration); // برای /start و action ها - Composer نه middleware
bot.use(userPanel);

bot.launch();
console.log('بات راه‌اندازی شد!');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));



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
