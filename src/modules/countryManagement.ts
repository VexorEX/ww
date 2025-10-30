import { Composer, Markup } from 'telegraf';
import { CustomContext } from '../middlewares/userAuth';
import { getCountryData } from '../utils/displayCountry';
import { escapeMarkdownV2 } from '../utils/escape';
import countries from '../config/countries.json';
import more from '../config/more.json';
import config from '../config/config.json';
import { prisma } from '../prisma';

const countryManagement = new Composer<CustomContext>();

function getContinentEmoji(countryCode: string): string {
    for (const [continent, list] of Object.entries(countries)) {
        if (countryCode in list) {
            switch (continent) {
                case 'america':
                    return '🌎 آمریکا';
                case 'asia':
                    return '🌏 آسیا';
                case 'europe':
                    return '🌍 اروپا';
                case 'africa':
                    return '🌍 آفریقا';
                case 'australia':
                    return '🌏 اقیانوسیه';
                default:
                    return '🌐 نامشخص';
            }
        }
    }
    return '🌐 نامشخص';
}

/**
 * Format numbers (supports number, string, and bigint).
 * Uses big-int arithmetic to avoid precision loss for very large values.
 * Returns a compact representation like "1.2B", "3.4M", "56K" or the raw number as string.
 */
function formatNumber(input: string | number | bigint): string {
    // Normalize to bigint
    let n: bigint;
    try {
        if (typeof input === 'bigint') {
            n = input;
        } else if (typeof input === 'number') {
            // Floor to avoid fractional issues
            n = BigInt(Math.floor(input));
        } else {
            // string -> remove commas and possible non-digits
            const cleaned = input.toString().replace(/,/g, '').trim();
            // If empty or not a number, return original
            if (!cleaned || !/^-?\d+$/.test(cleaned)) return input.toString();
            n = BigInt(cleaned);
        }
    } catch (e) {
        // Fallback to string conversion on error
        return String(input);
    }

    const ABS = n < 0n ? -n : n;
    const B = 1_000_000_000n;
    const M = 1_000_000n;
    const K = 1_000n;

    const sign = n < 0n ? '-' : '';

    // Helper to produce one decimal digit if necessary using integer arithmetic
    const withOneDecimal = (value: bigint, unit: bigint, suffix: string) => {
        const whole = value / unit;
        const rem = (value % unit) * 10n / unit; // 0..9
        if (rem === 0n) return `${sign}${whole.toString()}${suffix}`;
        return `${sign}${whole.toString()}.${rem.toString()}${suffix}`;
    };

    if (ABS >= B) return withOneDecimal(ABS, B, 'B');
    if (ABS >= M) return withOneDecimal(ABS, M, 'M');
    if (ABS >= K) return withOneDecimal(ABS, K, 'K');
    return sign + ABS.toString();
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
            Markup.button.callback(`🛡 ${formatNumber(user.security)}`, 'NA'),
            Markup.button.callback(`😊 ${formatNumber(user.satisfaction)}`, 'NA')
        ],
        [Markup.button.callback('═══════════════', 'NA')],
        [
            Markup.button.callback('🪨 منابع', 'get_resources'),
            Markup.button.callback('⚔️ نظامی', 'get_armies')
        ],
        [Markup.button.callback('🔙 بازگشت', 'back_main')]
    ]);
}

function buildReligionUpdateMessage(countryName: string, oldRel: string, newRel: string): string {
    return `${countryName} به طور رسمی دین رسمی خود را انتخاب کرد! 🕊

> دین قبلی: ${oldRel || 'نامشخص'}
> دین جدید: ${newRel}

شرح: کشور ${countryName} طی روزهای اخیر دین خود را به طور رسمی انتخاب و ثبت کرد 📝`;
}

function buildGovUpdateMessage(countryName: string, oldGov: string, newGov: string): string {
    return `${countryName} به طور رسمی نوع حکومت خود را انتخاب کرد! 👤

> حکومت قبلی: ${oldGov || 'نامشخص'}
> حکومت جدید: ${newGov}

شرح: کشور ${countryName} طی روزهای اخیر نوع حکومت خود را به طور رسمی انتخاب و ثبت کرد این کار ممکن است واکنش‌های مردمی مثبت یا منفی به دنبال داشته باشد 🏛`;
}

async function sendUpdateToChannel(type: 'religion' | 'gov', message: string, ctx: CustomContext) {
    const imageUrl = config.images[type]; // باید لینک مستقیم باشه
    const caption = escapeMarkdownV2(message);

    if (imageUrl?.startsWith('http')) {
        await ctx.telegram.sendPhoto(config.channels.updates, imageUrl, {
            caption,
            parse_mode: 'MarkdownV2'
        });
    } else {
        await ctx.telegram.sendMessage(config.channels.updates, caption, {
            parse_mode: 'MarkdownV2'
        });
    }
}

countryManagement.action('management', async (ctx) => {
    const country = ctx.user?.country;
    if (!country) return ctx.reply('❌ کشور شما مشخص نیست.');
    const result = await getCountryData(country);
    if (result.error || !result.user) return ctx.reply(result.error || '❌ اطلاعات کشور یافت نشد.');
    const keyboard = buildCountryInlineKeyboard(result.user);
    await ctx.reply(`🎯 مدیریت کشور ${result.user.countryName}`, keyboard);
});

countryManagement.action('set_gov', async (ctx) => {
    if (!config.manage.management.governments.status) {
        await ctx.answerCbQuery('⛔ تغییر حکومت در حال حاضر غیرفعال است.');
        return;
    }

    const keyboard = Markup.inlineKeyboard(
        Object.entries(more.governments).map(([key, label]) => [
            Markup.button.callback(label, `change_gov_${key}`)
        ])
    );
    await ctx.editMessageText('👑 نوع حکومت مورد نظر را انتخاب کن:', keyboard);
    ctx.answerCbQuery();
});

countryManagement.action(/^change_gov_(\w+)$/, async (ctx) => {
    const newGov = ctx.match[1];
    const user = await prisma.user.findUnique({ where: { userid: BigInt(ctx.from.id) } });
    const oldGov = user?.government || 'نامشخص';
    const countryName = user?.countryName || 'کشور شما';

    await prisma.user.update({
        where: { userid: BigInt(ctx.from.id) },
        data: { government: newGov }
    });

    await ctx.editMessageText(`✅ حکومت شما به ${more.governments[newGov]} تغییر یافت.`);
    ctx.answerCbQuery();

    const message = buildGovUpdateMessage(countryName, more.governments[oldGov] || oldGov, more.governments[newGov]);
    try {
        await sendUpdateToChannel('gov', message, ctx);
    } catch (err) {
        console.error('❌ خطا در ارسال پیام به کانال:', err);
    }
});

countryManagement.action('set_religion', async (ctx) => {
    if (!config.manage.management.religion.status) {
        await ctx.answerCbQuery('⛔ تغییر دین در حال حاضر غیرفعال است.');
        return;
    }

    const keyboard = Markup.inlineKeyboard(
        Object.entries(more.religion).map(([key, label]) => [
            Markup.button.callback(label, `change_religion_${key}`)
        ])
    );
    await ctx.editMessageText('🕌 دین مورد نظر را انتخاب کن:', keyboard);
    ctx.answerCbQuery();
});

countryManagement.action(/^change_religion_(\w+)$/, async (ctx) => {
    const newRel = ctx.match[1];
    const user = await prisma.user.findUnique({ where: { userid: BigInt(ctx.from.id) } });
    const oldRel = user?.religion || 'نامشخص';
    const countryName = user?.countryName || 'کشور شما';

    await prisma.user.update({
        where: { userid: BigInt(ctx.from.id) },
        data: { religion: newRel }
    });

    await ctx.editMessageText(`✅ دین شما به ${more.religion[newRel]} تغییر یافت.`);
    ctx.answerCbQuery();

    const message = buildReligionUpdateMessage(countryName, more.religion[oldRel] || oldRel, more.religion[newRel]);
    try {
        await sendUpdateToChannel('religion', message, ctx);
    } catch (err) {
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
const keyboardArm = Markup.inlineKeyboard([
    [
        Markup.button.callback(armyCategories[0].name, armyCategories[0].callback),
        Markup.button.callback(armyCategories[1].name, armyCategories[1].callback)
    ],
    [
        Markup.button.callback(armyCategories[2].name, armyCategories[2].callback),
        Markup.button.callback(armyCategories[3].name, armyCategories[3].callback)
    ],
    armyActions.map(a => Markup.button.callback(a.name, a.callback))
]);

const resourceCategories = [
    { name: '📦 منابع پایه', callback: 'res_base' },
    { name: '🏗 تجهیزات استخراج', callback: 'res_mines' },
];
const resourceActions = [
    { name: '🔙 بازگشت', callback: 'back_main' },
    { name: '❌ بستن', callback: 'delete' },
];
const keyboardRes = Markup.inlineKeyboard([
    [
        Markup.button.callback(resourceCategories[0].name, resourceCategories[0].callback),
        Markup.button.callback(resourceCategories[1].name, resourceCategories[1].callback)
    ],
    resourceActions.map(a => Markup.button.callback(a.name, a.callback))
]);

countryManagement.action('get_resources', async (ctx) => {
    await ctx.reply('📊 دسته‌بندی منابع کشور را انتخاب کن:', keyboardRes);
    ctx.answerCbQuery();
});

countryManagement.action('res_base', async (ctx) => {
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

countryManagement.action('res_mines', async (ctx) => {
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

function buildRow(label: string, value: string | number | bigint) {
    return [Markup.button.callback(label, 'NA'), Markup.button.callback(`${formatNumber(value as any)}`, 'NA')];
}

// Armies
countryManagement.action('army_ground', async (ctx) => {
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

countryManagement.action('army_marine', async (ctx) => {
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

countryManagement.action('army_aerial', async (ctx) => {
    const country = ctx.user?.country;
    const result = await getCountryData(country);
    if (result.error || !result.user) return ctx.reply(result.error || '❌ اطلاعات کشور یافت نشد.');
    const u = result.user;

    const keyboard = Markup.inlineKeyboard([
        buildRow('✈️ F-16', u.f16),
        buildRow('✈️ F-22', u.f22),
        buildRow('✈️ F-47', u.f47),
        buildRow('✈️ AM-50', u.am50),
        buildRow('✈️ TU-16', u.tu16),
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
        buildRow('🚀 موشک عبوری', u.crossRocket),
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

countryManagement.action('army_defence', async (ctx) => {
    const country = ctx.user?.country;
    const result = await getCountryData(country);
    if (result.error || !result.user) return ctx.reply(result.error || '❌ اطلاعات کشور یافت نشد.');
    const u = result.user;

    const keyboard = Markup.inlineKeyboard([
        buildRow('🛡 ضد موشک', u.antiRocket),
        buildRow('🛡 گنبد آهنین', u.ironDome),
        buildRow('🛡 S-400', u.s400),
        buildRow('🛡 S-300', u.s300),
        buildRow('🛡 TAAD', u.taad),
        buildRow('🛡 HQ-9', u.hq9),
        buildRow('🛡 آکاش', u.acash),
        [Markup.button.callback('🔙 بازگشت', 'get_armies')]
    ]);
    await ctx.reply('🛡 سامانه‌های دفاعی کشور شما:', keyboard);
    ctx.answerCbQuery();
});

export default countryManagement;