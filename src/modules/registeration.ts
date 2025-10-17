import { Composer, Markup } from 'telegraf';
import { prisma } from '../prisma';
import type { CustomContext as BaseCustomContext } from '../middlewares/userAuth';
import {
    formatCountryList,
    getAvailableCountries,
    getCountriesByRank,
    getCountriesByRegion,
    getCountryByName
} from '../utils/countryUtils';
import config from '../config/config.json';
import fc from '../config/fc.json';
import { escapeMarkdownV2 } from "../utils/escape";
import fs from 'fs';
import path from 'path';
import userPanel from "./userPanel";
const fcPath = path.join(__dirname, '../config/fc.json');

interface Country {
    country: string;
    rank: number;
    name: string;
    gov: string;
    lang: string;
    region?: string;
}
interface CustomContext extends BaseCustomContext {
    match: any;
    session?: {
        hasVolunteered?: boolean;
        requestUserId?: bigint;
        pendingUserId?: bigint;
        pendingCountry?: Country;
    };
}

const registration = new Composer<CustomContext>();
const ADMIN_COUNTRY_IDS : number[] = config.manage.country.admins || [];


async function sendRequestToAdmins(ctx: CustomContext, userId: bigint, username: string | undefined, firstName: string) {
    const hyperlink = `https://t.me/${username || userId}`;
    const countriesList = getAvailableCountries();
    const availableText = formatCountryList(countriesList, 'کشورهای در دسترس');

    const message = `
درخواست کننده: [${firstName}](${hyperlink})
userid: ${userId}
-------------------------
  `;

    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('رتبه', 'noop')],
        [Markup.button.callback('قدرت', `rank3_${userId}`), Markup.button.callback('قدرت بزرگ', `rank2_${userId}`)],
        [Markup.button.callback('قدرت منطقه‌ای', `rank1_${userId}`), Markup.button.callback('ساده', `rank0_${userId}`)],
        [Markup.button.callback('رد', `reject_${userId}`)]
    ]);

    // const keyboard = Markup.inlineKeyboard([
    //     [Markup.button.callback('رتبه', 'setCountry_rank_none')],
    //     [Markup.button.callback('قدرت', 'rank3'), Markup.button.callback('قدرت بزرگ', 'rank2')],
    //     [Markup.button.callback('قدرت منطقه‌ای', 'rank1'), Markup.button.callback('ساده', 'rank0')],
    //     [Markup.button.callback('منطقه', 'setCountry_region_none')],
    //     [Markup.button.callback('آسیا', 'setCountry_asia'), Markup.button.callback('اروپا', 'setCountry_europe')],
    //     [Markup.button.callback('آفریقا', 'setCountry_africa'), Markup.button.callback('آمریکا', 'setCountry_america')],
    //     [Markup.button.callback('استرالیا', 'setCountry_australia'), Markup.button.callback('رد', 'reject')],
    // ]);

    for (const adminId of ADMIN_COUNTRY_IDS) {
        try {
            await ctx.telegram.getChat(adminId);
            await ctx.telegram.sendMessage(adminId, message, { parse_mode: 'Markdown', ...keyboard });
        } catch (err) {
            console.error(`❌ ارسال پیام به ادمین ${adminId} ناموفق بود:`, err);
        }

    }
}
function handleRankAction(rank: number) {
    return async (ctx: CustomContext) => {
        const adminId = ctx.from.id;
        const userIdStr = ctx.match?.[1];
        if (!ADMIN_COUNTRY_IDS.includes(adminId)) return ctx.answerCbQuery('❌ دسترسی ندارید!');
        if (!userIdStr) return ctx.answerCbQuery('❌ شناسه کاربر موجود نیست!');
        const requestUserId = BigInt(userIdStr);

        const allRanked = getCountriesByRank(rank);
        const availableNames = getAvailableCountries();
        const filtered = allRanked.filter(c => {
            const code = c.country.toLowerCase();
            return !availableNames.includes(c.name) && !fc.includes(code);
        });

        if (filtered.length === 0) return ctx.answerCbQuery('❌ همه‌ی کشورها قبلاً تخصیص داده شده‌اند!');

        const keyboard = Markup.inlineKeyboard(
            filtered.map(c => {
                return [Markup.button.callback(c.name, `setCountry_${requestUserId}_${c.country}`)];
            }).filter(Boolean)
        );

        await ctx.reply(`🌍 کشورهای آزاد با رتبه ${rank}:`, keyboard);
        ctx.answerCbQuery();
    };
}

registration.command('start', async (ctx) => {
    if (ctx.user?.country) {
        await ctx.reply(`🎮 خوش آمدی ${ctx.from.first_name}! کشور شما: ${ctx.user.countryName}`);
        return;
    }
    if (!ctx.session) ctx.session = {};

    if (ctx.session.hasVolunteered) {
        await ctx.reply('✅ شما قبلاً داوطلب شده‌اید و منتظر اختصاص کشور هستید.');
        return;
    }

    if (!config.manage.country.status) {
        await ctx.reply("❌ فعلاً کشوردهی فعال نیست.");
        return;
    }

    await ctx.reply('👋 خوش آمدی! برای شروع بازی، لطفاً داوطلب شو.', Markup.inlineKeyboard([
        Markup.button.callback('✅ داوطلب شدن', 'getCountry')
    ]));
});

registration.action(['getCountry', 'request_country'], async (ctx) => {
    const userId = BigInt(ctx.from.id);
    const firstName = ctx.from.first_name || '';
    const username = ctx.from.username;
    if (!ctx.session) ctx.session = {};
    if (ctx.session.hasVolunteered) {
        return ctx.answerCbQuery('⛔ شما قبلاً داوطلب شده‌اید.');
    }

    ctx.session.hasVolunteered = true;

    await sendRequestToAdmins(ctx, userId, username, firstName);
    ctx.session ??= {};
    ctx.session.requestUserId = BigInt(ctx.from.id);
    await ctx.deleteMessage();
    await ctx.answerCbQuery('✅ درخواست شما به ادمین ارسال شد! منتظر تایید باشید.');
    await ctx.reply('درخواست ارسال شد. ادمین به زودی کشور شما را تنظیم می‌کند.');
});
registration.action(/^rank3_(\d+)$/, handleRankAction(3));
registration.action(/^rank2_(\d+)$/, handleRankAction(2));
registration.action(/^rank1_(\d+)$/, handleRankAction(1));
registration.action(/^rank0_(\d+)$/, handleRankAction(0));

registration.action(/reject_(\d+)/, async (ctx) => {
    const adminId = ctx.from.id;
    const requestUserId = BigInt(ctx.match[1]); // گرفتن userId از match

    if (!ADMIN_COUNTRY_IDS.includes(adminId)) {
        return ctx.answerCbQuery('❌ دسترسی ندارید!');
    }

    await ctx.telegram.sendMessage(Number(requestUserId), '❌ درخواست کشور شما رد شد.');
    await ctx.answerCbQuery('✅ درخواست رد شد.');
});

registration.action(/^setCountry_(\d+)_(\w+)$/, async (ctx) => {
    const [, userIdStr, countryKey] = ctx.match!;
    if (!/^\d+$/.test(userIdStr)) return ctx.answerCbQuery('❌ شناسه کاربر نامعتبر است.');
    const requestUserId = BigInt(userIdStr);
    const adminId = ctx.from.id;
    if (!ADMIN_COUNTRY_IDS.includes(adminId)) return ctx.answerCbQuery('❌ دسترسی ندارید!');

    const country = getCountryByName(countryKey);
    if (!country) return ctx.answerCbQuery('❌ کشور پیدا نشد!');


    // اگر region توی آبجکت نبود، می‌تونی دستی اضافه کنی یا از ساختار قبلی استفاده کنی
    const selectedCountry = { ...country, country: countryKey.toLowerCase() };

    ctx.session ??= {};
    ctx.session.pendingCountry = selectedCountry;
    ctx.session.pendingUserId = requestUserId;

    const countryCode = ctx.session.pendingCountry.country;
    if (fc.includes(countryCode)) {
        return ctx.answerCbQuery('⛔ این کشور قبلاً اختصاص داده شده است.');
    }

    const user = await prisma.user.findUnique({ where: { userid: requestUserId } });
    const username = user?.userid ? `@${user.userid}` : `کاربر ${requestUserId}`;

    const confirmKeyboard = Markup.inlineKeyboard([
        [Markup.button.callback('✅ تأیید', 'confirm_country')],
        [Markup.button.callback('🔄 انتخاب مجدد', `reselect_country_${requestUserId}`)]
    ]);

    await ctx.reply(`آیا مطمئنی که کشور ${selectedCountry.name} را برای ${username} انتخاب می‌کنی؟`, confirmKeyboard);
    ctx.answerCbQuery();
});

registration.action('confirm_country', async (ctx) => {
    const adminId = ctx.from.id;
    if (!ADMIN_COUNTRY_IDS.includes(adminId)) return ctx.answerCbQuery('❌ دسترسی ندارید!');

    const { pendingCountry, pendingUserId } = ctx.session ?? {};
    if (!pendingCountry || !pendingUserId) return ctx.answerCbQuery('❌ اطلاعات ناقص است!');

    await prisma.user.upsert({
        where: { userid: pendingUserId },
        update: {
            country: pendingCountry.country.toLowerCase(),
            countryName: pendingCountry.name,
            government: pendingCountry.gov,
            rank: pendingCountry.rank,
        },
        create: {
            userid: pendingUserId,
            country: pendingCountry.country.toLowerCase(),
            countryName: pendingCountry.name,
            government: pendingCountry.gov,
            rank: pendingCountry.rank,
            religion: 'سیک 🪯',
        },
    });

    await ctx.telegram.sendMessage(Number(pendingUserId), `✅ کشور شما تنظیم شد: ${pendingCountry.name}`);
    await ctx.reply(`✅ کشور ${pendingCountry.name} برای کاربر تنظیم شد.`);

    // گرفتن اطلاعات کاربری که کشور گرفته
    const userChat = await ctx.telegram.getChat(Number(pendingUserId));
    const username = 'username' in userChat && userChat.username
        ? userChat.username
        : pendingUserId.toString();

    const escapedCountry = escapeMarkdownV2(pendingCountry.name);
    const escapedUsername = escapeMarkdownV2(username);
    const escapedLink = escapeMarkdownV2(`tg://user?id=${pendingUserId}`);

    const updateText = `
🎆 *اختصاص کشور جدید* 🎆

> کشور *${escapedCountry}* به [@${escapedUsername}](${escapedLink}) اختصاص یافت\\!

برای این فرمانروا در فصل جدید آرزوی موفقیت داریم 🚀
`;

    await ctx.telegram.sendMessage(config.channels.updates, updateText.trim(), {
        parse_mode: 'MarkdownV2'
    });

    const countryCode = pendingCountry.country.toLowerCase();
    if (!fc.includes(countryCode)) {
        fc.push(countryCode);
        fs.writeFileSync(fcPath, JSON.stringify(fc, null, 2), 'utf-8');
    }

    ctx.session.pendingCountry = undefined;
    ctx.session.pendingUserId = undefined;
    ctx.answerCbQuery();
});

registration.action(/^reselect_country_(\d+)$/, async (ctx) => {
    const [, userIdStr] = ctx.match!;
    ctx.session.requestUserId = BigInt(userIdStr);

    // می‌تونی دوباره لیست کشورها رو بر اساس آخرین rank یا region نشون بدی
    await ctx.reply('🔄 لطفاً دوباره کشور را انتخاب کنید.');
    ctx.answerCbQuery();
});

registration.use(userPanel);

export default registration;