import { Composer, Markup } from 'telegraf';
import type { CustomContext } from '../middlewares/userAuth';
import config from '../config/config.json';
import { prisma } from "../prisma";

const shop = new Composer<CustomContext>();

const shopCategories = [
    { name: '🌍 زمینی', callback: 'buy_ground' },
    { name: '🌊 دریایی', callback: 'buy_marine' },
    { name: '✈️ هوایی', callback: 'buy_aerial' },
    { name: '🛡 دفاعی', callback: 'buy_defence' }
];

const shopActions = [
    { name: '🔙 بازگشت', callback: 'back_main' },
    { name: '❌ بستن', callback: 'delete' }
];

function chunk<T>(arr: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}

const keyboard = Markup.inlineKeyboard([
    ...chunk(shopCategories, 2).map(pair =>
        pair.map(c => Markup.button.callback(c.name, c.callback))
    ),
    shopActions.map(a => Markup.button.callback(a.name, a.callback))
]);

shop.action('shop', async (ctx) => {
    await ctx.reply('🛒 دسته‌بندی فروشگاه را انتخاب کن:', keyboard);
    ctx.answerCbQuery();
});

//
// ✅ نمایش آیتم‌های هر دسته با قیمت
//
function getEmojiForItem(item: string): string {
    const map: Record<string, string> = {
        soldier: '👨‍✈️', tank: '🛡', heavyTank: '🧱',
        f35: '✈️', f16: '✈️', su57: '✈️', b2: '✈️',
        battleship: '🚢', marineShip: '🛳', nuclearSubmarine: '☢',
        taad: '🛡', ironDome: '🛡', hq9: '🛡'
        // بقیه رو هم می‌تونی اضافه کنی
    };
    return map[item] || '📦';
}

function parsePrice(priceStr: string, qty: number): Record<string, number> {
    const parts = priceStr.split('+');
    const result: Record<string, number> = {};
    for (const part of parts) {
        const match = part.match(/(\d+)\((\w+)\)/);
        if (match) {
            const amount = Number(match[1]) * qty;
            const resource = match[2];
            result[resource] = (result[resource] || 0) + amount;
        }
    }
    return result;
}

function checkResources(user: any, cost: Record<string, number>): string[] {
    const lacks: string[] = [];
    for (const [res, amount] of Object.entries(cost)) {
        const current = BigInt(user[res] || 0);
        if (current < BigInt(amount)) lacks.push(`${res}: نیاز به ${amount}`);
    }
    return lacks;
}

function subtractResources(user: any, cost: Record<string, number>): Record<string, bigint> {
    const result: Record<string, bigint> = {};
    for (const [res, amount] of Object.entries(cost)) {
        const current = BigInt(user[res] || 0);
        result[res] = current - BigInt(amount);
    }
    return result;
}

function buildShopKeyboard(category: keyof typeof config.manage.shop.prices): Markup.Markup<any> {
    const items = config.manage.shop.prices[category];
    const rows = Object.entries(items).map(([key, price]) => {
        const label = `${key} (${price})`;
        return [Markup.button.callback(label, `buy_item_${category}_${key}`)];
    });

    rows.push(shopActions.map(a => Markup.button.callback(a.name, a.callback)));
    return Markup.inlineKeyboard(rows);
}

shop.action(/^buy_(ground|marine|aerial|defence)$/, async (ctx) => {
    const category = ctx.match[1] as keyof typeof config.manage.shop.prices;
    const items = config.manage.shop.prices[category];
    const rows: any[] = [];

    for (const [key, price] of Object.entries(items)) {
        const emoji = getEmojiForItem(key); // تابع کمکی برای ایموجی
        rows.push([
            Markup.button.callback(`${emoji} ${key}`, 'noop'),
            Markup.button.callback(`${price}`, 'noop'),
            Markup.button.callback('🛒 خرید', `buy_confirm_${category}_${key}`)
        ]);
    }

    rows.push(shopActions.map(a => Markup.button.callback(a.name, a.callback)));
    await ctx.reply(`🛒 دسته ${category} را انتخاب کن:`, Markup.inlineKeyboard(rows));
    ctx.answerCbQuery();
});

shop.action(/^buy_confirm_(ground|marine|aerial|defence)_(\w+)$/, async (ctx) => {
    const category = ctx.match[1];
    const item = ctx.match[2];

    ctx.session ??= {};
    ctx.session.buyStep = 'awaiting_quantity';
    ctx.session.buyCategory = category;
    ctx.session.buyItem = item;

    await ctx.reply(`🔢 تعداد "${item}" موردنظر را وارد کن:`);
    ctx.answerCbQuery();
});

shop.on('text', async (ctx, next) => {
    ctx.session ??= {};
    if (ctx.session.buyStep !== 'awaiting_quantity') return next();

    const qty = Number(ctx.message.text.trim());
    if (isNaN(qty) || qty <= 0) return ctx.reply('❌ تعداد معتبر نیست.');

    const { buyCategory, buyItem } = ctx.session;
    const priceStr = config.manage.shop.prices[buyCategory]?.[buyItem];
    if (!priceStr) return ctx.reply('❌ آیتم یافت نشد.');

    const user = await prisma.user.findUnique({ where: { userid: BigInt(ctx.from.id) } });
    if (!user) return ctx.reply('❌ کاربر یافت نشد.');

    const cost = parsePrice(priceStr, qty); // تابع کمکی برای تبدیل قیمت به عدد
    const lacks = checkResources(user, cost); // بررسی منابع

    if (lacks.length > 0) {
        return ctx.reply(`⛔ منابع کافی نیست:\n${lacks.map(r => `• ${r}`).join('\n')}`);
    }

    await prisma.user.update({
        where: { userid: BigInt(ctx.from.id) },
        data: subtractResources(user, cost) // تابع کمکی برای کم کردن منابع
    });

    await ctx.reply(`✅ خرید ${qty} عدد "${buyItem}" انجام شد.\nمقدار زیر از منابع شما کم شد:\n${Object.entries(cost).map(([k, v]) => `• ${v} ${k}`).join('\n')}`);
    ctx.session.buyStep = undefined;
});

//
// ✅ انتخاب آیتم خاص (در آینده می‌تونه به خرید وصل بشه)
//
shop.action(/^buy_item_(ground|marine|aerial|defence)_(\w+)$/, async (ctx) => {
    const category = ctx.match[1] as keyof typeof config.manage.shop.prices;
    const item = ctx.match[2];
    const price = config.manage.shop.prices[category]?.[item];

    if (!price) return ctx.answerCbQuery('❌ آیتم یافت نشد.');

    await ctx.reply(`✅ آیتم "${item}" انتخاب شد.\n💰 قیمت: ${price}`);
    ctx.answerCbQuery();
});


export default shop;
