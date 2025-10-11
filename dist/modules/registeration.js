"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const prisma_1 = require("../prisma");
const countryUtils_1 = require("../utils/countryUtils");
const admins_json_1 = __importDefault(require("../config/admins.json"));
const config_json_1 = __importDefault(require("../config/config.json"));
const fc_json_1 = __importDefault(require("../config/fc.json"));
const escape_1 = require("../utils/escape");
const registration = new telegraf_1.Composer();
const ADMIN_RESOURCE_IDS = admins_json_1.default.resource || [];
async function sendRequestToAdmins(ctx, userId, username, firstName) {
    const hyperlink = `https://t.me/${username || userId}`;
    const countriesList = (0, countryUtils_1.getAvailableCountries)();
    const availableText = (0, countryUtils_1.formatCountryList)(countriesList, 'کشورهای در دسترس');
    const message = `
درخواست کننده: [${firstName}](${hyperlink})
userid: ${userId}
-------------------------
  `;
    const keyboard = telegraf_1.Markup.inlineKeyboard([
        [telegraf_1.Markup.button.callback('رتبه', 'setCountry_rank_none')],
        [telegraf_1.Markup.button.callback('قدرت', `rank3_${userId}`), telegraf_1.Markup.button.callback('قدرت بزرگ', `rank2_${userId}`)],
        [telegraf_1.Markup.button.callback('قدرت منطقه‌ای', `rank1_${userId}`), telegraf_1.Markup.button.callback('ساده', `rank0_${userId}`)],
        [telegraf_1.Markup.button.callback('رد', `reject_${userId}`)]
    ]);
    for (const adminId of ADMIN_RESOURCE_IDS) {
        await ctx.telegram.sendMessage(adminId, message, { parse_mode: 'Markdown', ...keyboard });
    }
}
function handleRankAction(rank) {
    return async (ctx) => {
        const adminId = ctx.from.id;
        const userIdStr = ctx.match?.[1];
        if (!ADMIN_RESOURCE_IDS.includes(adminId))
            return ctx.answerCbQuery('❌ دسترسی ندارید!');
        if (!userIdStr)
            return ctx.answerCbQuery('❌ شناسه کاربر موجود نیست!');
        const requestUserId = BigInt(userIdStr);
        const allRanked = (0, countryUtils_1.getCountriesByRank)(rank);
        const availableNames = (0, countryUtils_1.getAvailableCountries)();
        const filtered = allRanked.filter(c => !availableNames.includes(c.name));
        if (filtered.length === 0)
            return ctx.answerCbQuery('❌ همه‌ی کشورها قبلاً تخصیص داده شده‌اند!');
        const keyboard = telegraf_1.Markup.inlineKeyboard(filtered.map(c => {
            return [telegraf_1.Markup.button.callback(c.name, `setCountry_${requestUserId}_${c.country}`)];
        }).filter(Boolean));
        await ctx.reply(`🌍 کشورهای آزاد با رتبه ${rank}:`, keyboard);
        ctx.answerCbQuery();
    };
}
registration.command('start', async (ctx) => {
    if (ctx.user?.country) {
        await ctx.reply(`🎮 خوش آمدی ${ctx.from.first_name}! کشور شما: ${ctx.user.countryName}`);
        return;
    }
    if (!ctx.session)
        ctx.session = {};
    if (ctx.session.hasVolunteered) {
        await ctx.reply('✅ شما قبلاً داوطلب شده‌اید و منتظر اختصاص کشور هستید.');
        return;
    }
    await ctx.reply('👋 خوش آمدی! برای شروع بازی، لطفاً داوطلب شو.', telegraf_1.Markup.inlineKeyboard([
        telegraf_1.Markup.button.callback('✅ داوطلب شدن', 'getCountry')
    ]));
});
registration.action(['getCountry', 'request_country'], async (ctx) => {
    const userId = BigInt(ctx.from.id);
    const firstName = ctx.from.first_name || '';
    const username = ctx.from.username;
    if (!ctx.session)
        ctx.session = {};
    if (ctx.session.hasVolunteered) {
        return ctx.answerCbQuery('⛔ شما قبلاً داوطلب شده‌اید.');
    }
    ctx.session.hasVolunteered = true;
    await sendRequestToAdmins(ctx, userId, username, firstName);
    ctx.session ?? (ctx.session = {});
    ctx.session.requestUserId = BigInt(ctx.from.id);
    await ctx.answerCbQuery('✅ درخواست شما به ادمین ارسال شد! منتظر تایید باشید.');
    await ctx.reply('درخواست ارسال شد. ادمین به زودی کشور شما را تنظیم می‌کند.');
});
registration.action(/^rank3_(\d+)$/, handleRankAction(3));
registration.action(/^rank2_(\d+)$/, handleRankAction(2));
registration.action(/^rank1_(\d+)$/, handleRankAction(1));
registration.action(/^rank0_(\d+)$/, handleRankAction(0));
registration.action('reject', async (ctx) => {
    const adminId = ctx.from.id;
    const requestUserId = ctx.session?.requestUserId;
    if (!ADMIN_RESOURCE_IDS.includes(adminId))
        return ctx.answerCbQuery('❌ دسترسی ندارید!');
    if (!requestUserId)
        return ctx.answerCbQuery('❌ کاربر پیدا نشد!');
    await ctx.telegram.sendMessage(Number(requestUserId), '❌ درخواست کشور شما رد شد.');
    ctx.answerCbQuery('✅ درخواست رد شد.');
});
registration.action(/^setCountry_(\d+)_(\w+)$/, async (ctx) => {
    const [, userIdStr, countryKey] = ctx.match;
    if (!/^\d+$/.test(userIdStr))
        return ctx.answerCbQuery('❌ شناسه کاربر نامعتبر است.');
    const requestUserId = BigInt(userIdStr);
    const adminId = ctx.from.id;
    if (!ADMIN_RESOURCE_IDS.includes(adminId))
        return ctx.answerCbQuery('❌ دسترسی ندارید!');
    const country = (0, countryUtils_1.getCountryByName)(countryKey);
    if (!country)
        return ctx.answerCbQuery('❌ کشور پیدا نشد!');
    const selectedCountry = { ...country, country: countryKey };
    ctx.session ?? (ctx.session = {});
    ctx.session.pendingCountry = selectedCountry;
    ctx.session.pendingUserId = requestUserId;
    const user = await prisma_1.prisma.user.findUnique({ where: { userid: requestUserId } });
    const username = user?.userid ? `@${user.userid}` : `کاربر ${requestUserId}`;
    const confirmKeyboard = telegraf_1.Markup.inlineKeyboard([
        [telegraf_1.Markup.button.callback('✅ تأیید', 'confirm_country')],
        [telegraf_1.Markup.button.callback('🔄 انتخاب مجدد', `reselect_country_${requestUserId}`)]
    ]);
    await ctx.reply(`آیا مطمئنی که کشور ${selectedCountry.name} را برای ${username} انتخاب می‌کنی؟`, confirmKeyboard);
    ctx.answerCbQuery();
});
registration.action('confirm_country', async (ctx) => {
    const adminId = ctx.from.id;
    if (!ADMIN_RESOURCE_IDS.includes(adminId))
        return ctx.answerCbQuery('❌ دسترسی ندارید!');
    const { pendingCountry, pendingUserId } = ctx.session ?? {};
    if (!pendingCountry || !pendingUserId)
        return ctx.answerCbQuery('❌ اطلاعات ناقص است!');
    await prisma_1.prisma.user.upsert({
        where: { userid: pendingUserId },
        update: {
            country: pendingCountry.name.split(' ')[0].toLowerCase(),
            countryName: pendingCountry.name,
            government: pendingCountry.gov,
            rank: pendingCountry.rank,
        },
        create: {
            userid: pendingUserId,
            country: pendingCountry.name.split(' ')[0].toLowerCase(),
            countryName: pendingCountry.name,
            government: pendingCountry.gov,
            rank: pendingCountry.rank,
            religion: 'سیک 🪯',
        },
    });
    const countryCode = pendingCountry.name.split(' ')[0].toLowerCase();
    if (!fc_json_1.default.includes(countryCode)) {
        fc_json_1.default.push(countryCode);
    }
    await ctx.telegram.sendMessage(Number(pendingUserId), `✅ کشور شما تنظیم شد: ${pendingCountry.name}`);
    await ctx.reply(`✅ کشور ${pendingCountry.name} برای کاربر تنظیم شد.`);
    const userChat = await ctx.telegram.getChat(Number(pendingUserId));
    const username = 'username' in userChat && userChat.username
        ? userChat.username
        : pendingUserId.toString();
    const escapedCountry = (0, escape_1.escapeMarkdownV2)(pendingCountry.name);
    const escapedUsername = (0, escape_1.escapeMarkdownV2)(username);
    const updateText = `
🎆 *اختصاص کشور جدید* 🎆

> کشور *${pendingCountry.name}* به [@${username}](tg://user?id=${pendingUserId}) اختصاص یافت\\!

برای این فرمانروا در فصل جدید آرزوی موفقیت داریم 🚀
`;
    await ctx.telegram.sendMessage(config_json_1.default.channels.updates, updateText.trim(), {
        parse_mode: 'MarkdownV2'
    });
    ctx.session.pendingCountry = undefined;
    ctx.session.pendingUserId = undefined;
    ctx.answerCbQuery();
});
registration.action(/^reselect_country_(\d+)$/, async (ctx) => {
    const [, userIdStr] = ctx.match;
    ctx.session.requestUserId = BigInt(userIdStr);
    await ctx.reply('🔄 لطفاً دوباره کشور را انتخاب کنید.');
    ctx.answerCbQuery();
});
exports.default = registration;
