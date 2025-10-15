import { Composer, Markup } from 'telegraf';
import { CustomContext } from '../../middlewares/userAuth';
import { getCountryData } from '../../utils/displayCountry';
import countries from '../../config/countries.json';
import more from '../../config/more.json';
import config from '../../config/config.json';
import {getCountryByUserId} from "../../utils/countryUtils";

const showUser = new Composer<CustomContext>();
const admins = config.manage.resource.admins

function getContinentEmoji(countryCode: string): string {
    for (const [continent, list] of Object.entries(countries)) {
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
function formatNumber(input: string | number): string {
    const num = typeof input === 'string' ? parseInt(input.replace(/,/g, ''), 10) : input;
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num.toString();
}
function getRankLabel(rank: number): string {
    return more.ranks[`rank${rank}`] || `رتبه ${rank}`;
}

function getReligionLabel(key: string): string {
    return more.religion[key] || key;
}
function buildCountryInlineKeyboard(user: any): Markup.Markup<any> {
    return Markup.inlineKeyboard([
        [
            Markup.button.callback(`${user.countryName}`, 'NA'),
            Markup.button.callback(`${more.governments[user.government] || user.government}`, 'set_gov'),
            Markup.button.callback(`${getReligionLabel(user.religion)}`, 'set_religion')
        ],
        [
            Markup.button.callback(getContinentEmoji(user.country), 'NA'),
            Markup.button.callback(`🎖 ${getRankLabel(user.rank)}`, 'NA')
        ],
        [Markup.button.callback('═══════════════', 'NA')],
        [
            Markup.button.callback('👥 جمعیت', 'NA'),
            Markup.button.callback('💰 درآمد روزانه', 'NA'),
            Markup.button.callback('🏦 سرمایه', 'NA')
        ],
        [
            Markup.button.callback(`👥 ${formatNumber(user.crowd)}`, 'NA'),
            Markup.button.callback(`💰 ${formatNumber(user.dailyProfit)}`, 'NA'),
            Markup.button.callback(`🏦 ${formatNumber(user.capital)}`, 'NA')
        ],
        [
            Markup.button.callback('🛡 امنیت', 'NA'),
            Markup.button.callback('😊 رضایت', 'NA')
        ],
        [
            Markup.button.callback(`🛡 ${user.security}`, 'NA'),
            Markup.button.callback(`😊 ${user.satisfaction}`, 'NA')
        ],
        [Markup.button.callback('═══════════════', 'NA')],
        [
            Markup.button.callback('🪨 منابع', 'get_resources'),
            Markup.button.callback('⚔️ نظامی', 'get_armies')
        ],
        [Markup.button.callback('🔙 بازگشت', 'back_main')]
    ]);
}

showUser.action('admin_resourceStats', async (ctx) => {
    const adminIds = admins || [];
    if (!adminIds.includes(ctx.from?.id)) {
        return ctx.reply('⛔️ فقط ادمین‌ها به این بخش دسترسی دارند.');
    }

    ctx.session.awaitingUserId = true;
    return ctx.reply('🆔 لطفاً آیدی عددی کاربر را ارسال کنید:');
});
showUser.on('text', async (ctx) => {
    if (!ctx.session.awaitingUserId) return;

    const adminIds = admins || [];
    if (!adminIds.includes(ctx.from?.id)) {
        return ctx.reply('⛔️ فقط ادمین‌ها به این بخش دسترسی دارند.');
    }

    const userId = Number(ctx.message.text.trim());
    if (isNaN(userId)) return ctx.reply('❌ آیدی معتبر نیست. لطفاً فقط عدد وارد کنید.');

    ctx.session.awaitingUserId = false;

    const countryCode = await getCountryByUserId(userId);
    if (!countryCode) return ctx.reply('❌ کشور مشخص نیست.');

    const result = await getCountryData(countryCode);
    if (result.error || !result.user) return ctx.reply(result.error || '❌ اطلاعات کشور یافت نشد.');

    const keyboard = buildCountryInlineKeyboard(result.user);
    await ctx.reply(`🎯 مدیریت کشور ${result.user.countryName}`, keyboard);
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
const keyboardArm = Markup.inlineKeyboard([
    [Markup.button.callback(armyCategories[0].name, armyCategories[0].callback),
        Markup.button.callback(armyCategories[1].name, armyCategories[1].callback)],
    [Markup.button.callback(armyCategories[2].name, armyCategories[2].callback),
        Markup.button.callback(armyCategories[3].name, armyCategories[3].callback)],
    armyActions.map(a => Markup.button.callback(a.name, a.callback))
]);
showUser.action('get_armies', async (ctx) => {
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
const keyboardRes = Markup.inlineKeyboard([
    [Markup.button.callback(resourceCategories[0].name, resourceCategories[0].callback),
        Markup.button.callback(resourceCategories[1].name, resourceCategories[1].callback)],
    resourceActions.map(a => Markup.button.callback(a.name, a.callback))
]);
showUser.action('get_resources', async (ctx) => {
    await ctx.reply('📊 دسته‌بندی منابع کشور را انتخاب کن:', keyboardRes);
    ctx.answerCbQuery();
});
showUser.action('res_base', async (ctx) => {
    const country = ctx.user?.country;
    const result = await getCountryData(country);
    if (result.error || !result.user) return ctx.reply(result.error || '❌ اطلاعات کشور یافت نشد.');
    const u = result.user;

    const keyboard = Markup.inlineKeyboard([
        buildRow('🔩 آهن', u.iron),
        buildRow('💰 طلا', u.gold),
        buildRow('☢ اورانیوم', u.uranium),
        buildRow('🛢 نفت', u.oil),
        [Markup.button.callback('🔙 بازگشت', 'get_resources')]
    ]);

    await ctx.reply('📦 منابع پایه کشور شما:', keyboard);
    ctx.answerCbQuery();
});
showUser.action('res_mines', async (ctx) => {
    const country = ctx.user?.country;
    const result = await getCountryData(country);
    if (result.error || !result.user) return ctx.reply(result.error || '❌ اطلاعات کشور یافت نشد.');
    const u = result.user;

    const keyboard = Markup.inlineKeyboard([
        buildRow('⛏ معدن آهن', u.ironMine),
        buildRow('🏆 معدن طلا', u.goldMine),
        buildRow('⚛ معدن اورانیوم', u.uraniumMine),
        buildRow('🏭 پالایشگاه نفت', u.refinery),
        [Markup.button.callback('🔙 بازگشت', 'get_resources')]
    ]);

    await ctx.reply('🏗 تجهیزات استخراج کشور شما:', keyboard);
    ctx.answerCbQuery();
});

function buildRow(label: string, value: string | number) {
    return [Markup.button.callback(label, 'NA'), Markup.button.callback(`${value}`, 'NA')];
}

showUser.action('get_armies', async (ctx) => {
    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('🌍 زمینی', 'army_ground')],
        [Markup.button.callback('🌊 دریایی', 'army_marine')],
        [Markup.button.callback('✈️ هوایی', 'army_aerial')],
        [Markup.button.callback('🛡 دفاعی', 'army_defence')],
        [Markup.button.callback('🔙 بازگشت', 'back_main')]
    ]);
    await ctx.reply('⚔️ دسته‌بندی نیروهای نظامی را انتخاب کن:', keyboard);
    ctx.answerCbQuery();
});
showUser.action('army_ground', async (ctx) => {
    const country = ctx.user?.country;
    const result = await getCountryData(country);
    if (result.error || !result.user) return ctx.reply(result.error || '❌ اطلاعات کشور یافت نشد.');
    const u = result.user;

    const keyboard = Markup.inlineKeyboard([
        buildRow('👨‍✈️ پیاده‌نظام', u.soldier),
        buildRow('🛡 تانک سبک', u.tank),
        buildRow('🧱 تانک سنگین', u.heavyTank),
        [Markup.button.callback('🔙 بازگشت', 'get_armies')]
    ]);
    await ctx.reply('🌍 نیروهای زمینی کشور شما:', keyboard);
    ctx.answerCbQuery();
});
showUser.action('army_marine', async (ctx) => {
    const country = ctx.user?.country;
    const result = await getCountryData(country);
    if (result.error || !result.user) return ctx.reply(result.error || '❌ اطلاعات کشور یافت نشد.');
    const u = result.user;

    const keyboard = Markup.inlineKeyboard([
        buildRow('🚢 نبردناو', u.battleship),
        buildRow('🛳 کشتی دریایی', u.marineShip),
        buildRow('⚓️ شکننده دریایی', u.breakerShip),
        buildRow('☢ زیردریایی هسته‌ای', u.nuclearSubmarine),
        [Markup.button.callback('🔙 بازگشت', 'get_armies')]
    ]);
    await ctx.reply('🌊 نیروهای دریایی کشور شما:', keyboard);
    ctx.answerCbQuery();
});
showUser.action('army_aerial', async (ctx) => {
    const country = ctx.user?.country;
    const result = await getCountryData(country);
    if (result.error || !result.user) return ctx.reply(result.error || '❌ اطلاعات کشور یافت نشد.');
    const u = result.user;

    const keyboard = Markup.inlineKeyboard([
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
        [Markup.button.callback('🔙 بازگشت', 'get_armies')]
    ]);
    await ctx.reply('✈️ نیروهای هوایی کشور شما:', keyboard);
    ctx.answerCbQuery();
});
showUser.action('army_defence', async (ctx) => {
    const country = ctx.user?.country;
    const result = await getCountryData(country);
    if (result.error || !result.user) return ctx.reply(result.error || '❌ اطلاعات کشور یافت نشد.');
    const u = result.user;

    const keyboard = Markup.inlineKeyboard([
        buildRow('🛡 ضد موشک', u.antiRocket),
        buildRow('🛡 گنبد آهنین', u.ironDome),
        buildRow('🛡 S-400', u.s400),
        buildRow('🛡 TAAD', u.taad),
        buildRow('🛡 HQ-9', u.hq9),
        buildRow('🛡 آکاش', u.acash),
        [Markup.button.callback('🔙 بازگشت', 'get_armies')]
    ]);
    await ctx.reply('🛡 سامانه‌های دفاعی کشور شما:', keyboard);
    ctx.answerCbQuery();
});

export default showUser;