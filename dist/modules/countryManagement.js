"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const displayCountry_1 = require("../utils/displayCountry");
const escape_1 = require("../utils/escape");
const countries_json_1 = __importDefault(require("../config/countries.json"));
const more_json_1 = __importDefault(require("../config/more.json"));
const config_json_1 = __importDefault(require("../config/config.json"));
const prisma_1 = require("../prisma");
const countryManagement = new telegraf_1.Composer();
function getContinentEmoji(countryCode) {
    for (const [continent, list] of Object.entries(countries_json_1.default)) {
        if (countryCode in list) {
            switch (continent) {
                case 'america': return '🌎 آمریکا';
                case 'asia': return '🌏 آسیا';
                case 'europe': return '🌍 اروپا';
                case 'africa': return '🌍 آفریقا';
                case 'australia': return '🌏 اقیانوسیه';
                default: return '🌐 نامشخص';
            }
        }
    }
    return '🌐 نامشخص';
}
function formatNumber(input) {
    const num = typeof input === 'string' ? parseInt(input.replace(/,/g, ''), 10) : input;
    if (num >= 1000000000)
        return (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000)
        return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000)
        return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}
function getRankLabel(rank) {
    return more_json_1.default.ranks[`rank${rank}`] || `رتبه ${rank}`;
}
function getReligionLabel(key) {
    return more_json_1.default.religion[key] || key;
}
function buildCountryInlineKeyboard(user) {
    return telegraf_1.Markup.inlineKeyboard([
        [
            telegraf_1.Markup.button.callback(`${user.countryName}`, 'NA'),
            telegraf_1.Markup.button.callback(`${more_json_1.default.governments[user.government] || user.government}`, 'set_gov'),
            telegraf_1.Markup.button.callback(`${getReligionLabel(user.religion)}`, 'set_religion')
        ],
        [
            telegraf_1.Markup.button.callback(getContinentEmoji(user.country), 'NA'),
            telegraf_1.Markup.button.callback(`🎖 ${getRankLabel(user.rank)}`, 'NA')
        ],
        [telegraf_1.Markup.button.callback('═══════════════', 'NA')],
        [
            telegraf_1.Markup.button.callback('👥 جمعیت', 'NA'),
            telegraf_1.Markup.button.callback('💰 درآمد روزانه', 'NA'),
            telegraf_1.Markup.button.callback('🏦 سرمایه', 'NA')
        ],
        [
            telegraf_1.Markup.button.callback(`👥 ${formatNumber(user.crowd)}`, 'NA'),
            telegraf_1.Markup.button.callback(`💰 ${formatNumber(user.dailyProfit)}`, 'NA'),
            telegraf_1.Markup.button.callback(`🏦 ${formatNumber(user.capital)}`, 'NA')
        ],
        [
            telegraf_1.Markup.button.callback('🛡 امنیت', 'NA'),
            telegraf_1.Markup.button.callback('😊 رضایت', 'NA')
        ],
        [
            telegraf_1.Markup.button.callback(`🛡 ${user.security}`, 'NA'),
            telegraf_1.Markup.button.callback(`😊 ${user.satisfaction}`, 'NA')
        ],
        [telegraf_1.Markup.button.callback('═══════════════', 'NA')],
        [
            telegraf_1.Markup.button.callback('🪨 منابع', 'get_resources'),
            telegraf_1.Markup.button.callback('⚔️ نظامی', 'get_armies')
        ],
        [telegraf_1.Markup.button.callback('🔙 بازگشت', 'back_main')]
    ]);
}
function buildReligionUpdateMessage(countryName, oldRel, newRel) {
    return `${countryName} به طور رسمی دین رسمی خود را انتخاب کرد! 🕊

> دین قبلی: ${oldRel || 'نامشخص'}
> دین جدید: ${newRel}

شرح: کشور ${countryName} طی روزهای اخیر دین خود را به طور رسمی انتخاب و ثبت کرد 📝`;
}
function buildGovUpdateMessage(countryName, oldGov, newGov) {
    return `${countryName} به طور رسمی نوع حکومت خود را انتخاب کرد! 👤

> حکومت قبلی: ${oldGov || 'نامشخص'}
> حکومت جدید: ${newGov}

شرح: کشور ${countryName} طی روزهای اخیر نوع حکومت خود را به طور رسمی انتخاب و ثبت کرد این کار ممکن است واکنش‌های مردمی مثبت یا منفی به دنبال داشته باشد 🏛`;
}
async function sendUpdateToChannel(type, message, ctx) {
    const imageUrl = config_json_1.default.images[type];
    const caption = (0, escape_1.escapeMarkdownV2)(message);
    if (imageUrl?.startsWith('http')) {
        await ctx.telegram.sendPhoto(config_json_1.default.channels.updates, imageUrl, {
            caption,
            parse_mode: 'MarkdownV2'
        });
    }
    else {
        await ctx.telegram.sendMessage(config_json_1.default.channels.updates, caption, {
            parse_mode: 'MarkdownV2'
        });
    }
}
countryManagement.action('management', async (ctx) => {
    const country = ctx.user?.country;
    if (!country)
        return ctx.reply('❌ کشور شما مشخص نیست.');
    const result = await (0, displayCountry_1.getCountryData)(country);
    if (result.error || !result.user)
        return ctx.reply(result.error || '❌ اطلاعات کشور یافت نشد.');
    const keyboard = buildCountryInlineKeyboard(result.user);
    await ctx.reply(`🎯 مدیریت کشور ${result.user.countryName}`, keyboard);
});
countryManagement.action('set_gov', async (ctx) => {
    const keyboard = telegraf_1.Markup.inlineKeyboard(Object.entries(more_json_1.default.governments).map(([key, label]) => [
        telegraf_1.Markup.button.callback(label, `change_gov_${key}`)
    ]));
    await ctx.editMessageText('👑 نوع حکومت مورد نظر را انتخاب کن:', keyboard);
    ctx.answerCbQuery();
});
countryManagement.action(/^change_gov_(\w+)$/, async (ctx) => {
    const newGov = ctx.match[1];
    const user = await prisma_1.prisma.user.findUnique({ where: { userid: BigInt(ctx.from.id) } });
    const oldGov = user?.government || 'نامشخص';
    const countryName = user?.countryName || 'کشور شما';
    await prisma_1.prisma.user.update({
        where: { userid: BigInt(ctx.from.id) },
        data: { government: newGov }
    });
    await ctx.editMessageText(`✅ حکومت شما به ${more_json_1.default.governments[newGov]} تغییر یافت.`);
    ctx.answerCbQuery();
    const message = buildGovUpdateMessage(countryName, more_json_1.default.governments[oldGov] || oldGov, more_json_1.default.governments[newGov]);
    try {
        await sendUpdateToChannel('gov', message, ctx);
    }
    catch (err) {
        console.error('❌ خطا در ارسال پیام به کانال:', err);
    }
});
countryManagement.action('set_religion', async (ctx) => {
    const keyboard = telegraf_1.Markup.inlineKeyboard(Object.entries(more_json_1.default.religion).map(([key, label]) => [
        telegraf_1.Markup.button.callback(label, `change_religion_${key}`)
    ]));
    await ctx.editMessageText('🕌 دین مورد نظر را انتخاب کن:', keyboard);
    ctx.answerCbQuery();
});
countryManagement.action(/^change_religion_(\w+)$/, async (ctx) => {
    const newRel = ctx.match[1];
    const user = await prisma_1.prisma.user.findUnique({ where: { userid: BigInt(ctx.from.id) } });
    const oldRel = user?.religion || 'نامشخص';
    const countryName = user?.countryName || 'کشور شما';
    await prisma_1.prisma.user.update({
        where: { userid: BigInt(ctx.from.id) },
        data: { religion: newRel }
    });
    await ctx.editMessageText(`✅ دین شما به ${more_json_1.default.religion[newRel]} تغییر یافت.`);
    ctx.answerCbQuery();
    const message = buildReligionUpdateMessage(countryName, more_json_1.default.religion[oldRel] || oldRel, more_json_1.default.religion[newRel]);
    try {
        await sendUpdateToChannel('religion', message, ctx);
    }
    catch (err) {
        console.error('❌ خطا در ارسال پیام به کانال:', err);
    }
});
const armyCategories = [
    { name: '🌍 نیروهای زمینی', callback: 'army_ground' },
    { name: '🛡 سامانه‌های دفاعی', callback: 'army_defence' },
    { name: '🌊 نیروهای دریایی', callback: 'army_marine' },
    { name: '✈️ نیروهای هوایی', callback: 'army_aerial' },
];
const armyActions = [
    { name: '🔙 بازگشت', callback: 'back_main' },
    { name: '❌ بستن', callback: 'delete' },
];
const keyboardArm = telegraf_1.Markup.inlineKeyboard([
    [telegraf_1.Markup.button.callback(armyCategories[0].name, armyCategories[0].callback),
        telegraf_1.Markup.button.callback(armyCategories[1].name, armyCategories[1].callback)],
    [telegraf_1.Markup.button.callback(armyCategories[2].name, armyCategories[2].callback),
        telegraf_1.Markup.button.callback(armyCategories[3].name, armyCategories[3].callback)],
    armyActions.map(a => telegraf_1.Markup.button.callback(a.name, a.callback))
]);
countryManagement.action('get_armies', async (ctx) => {
    await ctx.reply('⚔️ دسته‌بندی نیروهای نظامی را انتخاب کن:', keyboardArm);
    ctx.answerCbQuery();
});
const resourceCategories = [
    { name: '📦 منابع پایه', callback: 'res_base' },
    { name: '🏗 تجهیزات استخراج', callback: 'res_mines' },
];
const resourceActions = [
    { name: '🔙 بازگشت', callback: 'back_main' },
    { name: '❌ بستن', callback: 'delete' },
];
const keyboardRes = telegraf_1.Markup.inlineKeyboard([
    [telegraf_1.Markup.button.callback(resourceCategories[0].name, resourceCategories[0].callback),
        telegraf_1.Markup.button.callback(resourceCategories[1].name, resourceCategories[1].callback)],
    resourceActions.map(a => telegraf_1.Markup.button.callback(a.name, a.callback))
]);
countryManagement.action('get_resources', async (ctx) => {
    await ctx.reply('📊 دسته‌بندی منابع کشور را انتخاب کن:', keyboardRes);
    ctx.answerCbQuery();
});
countryManagement.action('res_base', async (ctx) => {
    const country = ctx.user?.country;
    const result = await (0, displayCountry_1.getCountryData)(country);
    if (result.error || !result.user)
        return ctx.reply(result.error || '❌ اطلاعات کشور یافت نشد.');
    const u = result.user;
    const keyboard = telegraf_1.Markup.inlineKeyboard([
        buildRow('🔩 آهن', u.iron),
        buildRow('💰 طلا', u.gold),
        buildRow('☢ اورانیوم', u.uranium),
        buildRow('🛢 نفت', u.oil),
        [telegraf_1.Markup.button.callback('🔙 بازگشت', 'get_resources')]
    ]);
    await ctx.reply('📦 منابع پایه کشور شما:', keyboard);
    ctx.answerCbQuery();
});
countryManagement.action('res_mines', async (ctx) => {
    const country = ctx.user?.country;
    const result = await (0, displayCountry_1.getCountryData)(country);
    if (result.error || !result.user)
        return ctx.reply(result.error || '❌ اطلاعات کشور یافت نشد.');
    const u = result.user;
    const keyboard = telegraf_1.Markup.inlineKeyboard([
        buildRow('⛏ معدن آهن', u.ironMine),
        buildRow('🏆 معدن طلا', u.goldMine),
        buildRow('⚛ معدن اورانیوم', u.uraniumMine),
        buildRow('🏭 پالایشگاه نفت', u.refinery),
        [telegraf_1.Markup.button.callback('🔙 بازگشت', 'get_resources')]
    ]);
    await ctx.reply('🏗 تجهیزات استخراج کشور شما:', keyboard);
    ctx.answerCbQuery();
});
function buildRow(label, value) {
    return [telegraf_1.Markup.button.callback(label, 'NA'), telegraf_1.Markup.button.callback(`${value}`, 'NA')];
}
countryManagement.action('get_armies', async (ctx) => {
    const keyboard = telegraf_1.Markup.inlineKeyboard([
        [telegraf_1.Markup.button.callback('🌍 زمینی', 'army_ground')],
        [telegraf_1.Markup.button.callback('🌊 دریایی', 'army_marine')],
        [telegraf_1.Markup.button.callback('✈️ هوایی', 'army_aerial')],
        [telegraf_1.Markup.button.callback('🛡 دفاعی', 'army_defence')],
        [telegraf_1.Markup.button.callback('🔙 بازگشت', 'back_main')]
    ]);
    await ctx.reply('⚔️ دسته‌بندی نیروهای نظامی را انتخاب کن:', keyboard);
    ctx.answerCbQuery();
});
countryManagement.action('army_ground', async (ctx) => {
    const country = ctx.user?.country;
    const result = await (0, displayCountry_1.getCountryData)(country);
    if (result.error || !result.user)
        return ctx.reply(result.error || '❌ اطلاعات کشور یافت نشد.');
    const u = result.user;
    const keyboard = telegraf_1.Markup.inlineKeyboard([
        buildRow('👨‍✈️ پیاده‌نظام', u.soldier),
        buildRow('🛡 تانک سبک', u.tank),
        buildRow('🧱 تانک سنگین', u.heavyTank),
        [telegraf_1.Markup.button.callback('🔙 بازگشت', 'get_armies')]
    ]);
    await ctx.reply('🌍 نیروهای زمینی کشور شما:', keyboard);
    ctx.answerCbQuery();
});
countryManagement.action('army_marine', async (ctx) => {
    const country = ctx.user?.country;
    const result = await (0, displayCountry_1.getCountryData)(country);
    if (result.error || !result.user)
        return ctx.reply(result.error || '❌ اطلاعات کشور یافت نشد.');
    const u = result.user;
    const keyboard = telegraf_1.Markup.inlineKeyboard([
        buildRow('🚢 نبردناو', u.battleship),
        buildRow('🛳 کشتی دریایی', u.marineShip),
        buildRow('⚓️ شکننده دریایی', u.breakerShip),
        buildRow('☢ زیردریایی هسته‌ای', u.nuclearSubmarine),
        [telegraf_1.Markup.button.callback('🔙 بازگشت', 'get_armies')]
    ]);
    await ctx.reply('🌊 نیروهای دریایی کشور شما:', keyboard);
    ctx.answerCbQuery();
});
countryManagement.action('army_aerial', async (ctx) => {
    const country = ctx.user?.country;
    const result = await (0, displayCountry_1.getCountryData)(country);
    if (result.error || !result.user)
        return ctx.reply(result.error || '❌ اطلاعات کشور یافت نشد.');
    const u = result.user;
    const keyboard = telegraf_1.Markup.inlineKeyboard([
        buildRow('✈️ F-16', u.f16),
        buildRow('✈️ F-22', u.f22),
        buildRow('✈️ F-35', u.f35),
        buildRow('✈️ J-20', u.j20),
        buildRow('✈️ SU-57', u.su57),
        buildRow('✈️ B-2', u.b2),
        buildRow('🛩 پهپاد جاسوسی', u.espionageDrone),
        buildRow('🛩 پهپاد انتحاری', u.suicideDrone),
        buildRow('🛩 پهپاد عبوری', u.crossDrone),
        buildRow('🛩 پهپاد شاهد', u.witnessDrone),
        buildRow('🚀 موشک ساده', u.simpleRocket),
        buildRow('🚀 موشک نقطه‌زن', u.dotTargetRocket),
        buildRow('🚀 موشک قاره‌پیما', u.continentalRocket),
        buildRow('🚀 موشک بالستیک', u.ballisticRocket),
        buildRow('🚀 موشک شیمیایی', u.chemicalRocket),
        buildRow('🚀 موشک هایپرسونیک', u.hyperSonicRocket),
        buildRow('🚀 موشک خوشه‌ای', u.clusterRocket),
        [telegraf_1.Markup.button.callback('🔙 بازگشت', 'get_armies')]
    ]);
    await ctx.reply('✈️ نیروهای هوایی کشور شما:', keyboard);
    ctx.answerCbQuery();
});
countryManagement.action('army_defence', async (ctx) => {
    const country = ctx.user?.country;
    const result = await (0, displayCountry_1.getCountryData)(country);
    if (result.error || !result.user)
        return ctx.reply(result.error || '❌ اطلاعات کشور یافت نشد.');
    const u = result.user;
    const keyboard = telegraf_1.Markup.inlineKeyboard([
        buildRow('🛡 ضد موشک', u.antiRocket),
        buildRow('🛡 گنبد آهنین', u.ironDome),
        buildRow('🛡 S-400', u.s400),
        buildRow('🛡 TAAD', u.taad),
        buildRow('🛡 HQ-9', u.hq9),
        buildRow('🛡 آکاش', u.acash),
        [telegraf_1.Markup.button.callback('🔙 بازگشت', 'get_armies')]
    ]);
    await ctx.reply('🛡 سامانه‌های دفاعی کشور شما:', keyboard);
    ctx.answerCbQuery();
});
exports.default = countryManagement;
