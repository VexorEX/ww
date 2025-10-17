import { Composer, Markup } from 'telegraf';
import type { CustomContext } from '../middlewares/userAuth';
import config from '../config/config.json';
import more from '../config/more.json';
import { prisma } from '../prisma';
import { changeUserField } from './economy';

const shop = new Composer<CustomContext>();

const shopCategories = [
    { name: '🌍 زمینی', callback: 'buy_ground' },
    { name: '🌊 دریایی', callback: 'buy_marine' },
    { name: '✈️ هوایی', callback: 'buy_aerial' },
    { name: '🛡 دفاعی', callback: 'buy_defence' },
    { name: '🚀 موشکی', callback: 'buy_missile' }
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

function checkCountryPermission(userCountry: string, item: string): boolean {
    // اگر آیتم در لیست پیش‌فرض باشد، همه کشورها می‌توانند آن را بخرند
    if (config.manage.shop.defaultItems.includes(item)) {
        return true;
    }

    // اگر کشور کاربر در لیست مجوزها نباشد، نمی‌تواند چیزی بجز آیتم‌های پیش‌فرض بخرد
    if (!config.manage.shop.countryPermissions[userCountry]) {
        return false;
    }

    // بررسی اینکه آیا آیتم در لیست مجوزهای کشور کاربر هست یا نه
    return config.manage.shop.countryPermissions[userCountry].includes(item);
}

function buildShopKeyboard(category: keyof typeof config.manage.shop.prices, userCountry?: string): Markup.Markup<any> {
    const prices = config.manage.shop.prices[category];
    const labels = more.armyLabels?.[category] || {};
    const rows: any[] = [];

    for (const [key, price] of Object.entries(prices)) {
        // اگر کشور کاربر مشخص شده و آیتم در لیست مجوزهای آن کشور نیست، نمایش نده
        if (userCountry && !checkCountryPermission(userCountry, key)) {
            continue;
        }

        const label = labels[key] || key;
        const priceFa = price
            .replace(/iron/g, 'آهن')
            .replace(/oil/g, 'نفت')
            .replace(/crowd/g, 'جمعیت')
            .replace(/capital/g, 'سرمایه');

        rows.push([
            Markup.button.callback(label, 'noop'),
            Markup.button.callback(priceFa, 'noop'),
            Markup.button.callback('🛒 خرید', `buy_confirm_${category}_${key}`)
        ]);
    }

    rows.push(shopActions.map(a => Markup.button.callback(a.name, a.callback)));
    return Markup.inlineKeyboard(rows);
}

shop.action(/^buy_(ground|marine|aerial|defence|missile)$/, async (ctx) => {
    const category = ctx.match[1] as keyof typeof config.manage.shop.prices;

    // دریافت اطلاعات کاربر برای بررسی کشور
    const user = await prisma.user.findUnique({ where: { userid: BigInt(ctx.from.id) } });
    if (!user) return ctx.reply('❌ کاربر یافت نشد.');

    const keyboard = buildShopKeyboard(category, user.country);
    await ctx.reply(`🛒 آیتم‌های دسته ${category} را انتخاب کن:`, keyboard);
    ctx.answerCbQuery();
});

shop.action(/^buy_confirm_(ground|marine|aerial|defence|missile)_(\w+)$/, async (ctx) => {
    const category = ctx.match[1];
    const item = ctx.match[2];

    // دریافت اطلاعات کاربر برای بررسی کشور
    const user = await prisma.user.findUnique({ where: { userid: BigInt(ctx.from.id) } });
    if (!user) return ctx.reply('❌ کاربر یافت نشد.');

    // بررسی مجوز کشور برای خرید این آیتم
    if (!checkCountryPermission(user.country, item)) {
        return ctx.reply(`❌ کشور شما (${user.country}) مجوز خرید "${item}" را ندارد.`);
    }

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

    // دریافت اطلاعات کاربر برای بررسی کشور
    const user = await prisma.user.findUnique({ where: { userid: BigInt(ctx.from.id) } });
    if (!user) return ctx.reply('❌ کاربر یافت نشد.');

    // بررسی مجدد مجوز کشور برای اطمینان
    if (!checkCountryPermission(user.country, buyItem)) {
        delete ctx.session.buyStep;
        delete ctx.session.buyCategory;
        delete ctx.session.buyItem;
        return ctx.reply(`❌ کشور شما (${user.country}) مجوز خرید "${buyItem}" را ندارد.`);
    }

    const priceStr = config.manage.shop.prices[buyCategory]?.[buyItem];
    if (!priceStr) return ctx.reply('❌ آیتم یافت نشد.');

    const cost = parsePrice(priceStr, qty);
    const lacks = checkResources(user, cost);
    if (lacks.length > 0) {
        return ctx.reply(`⛔ منابع کافی نیست:\n${lacks.map(r => `• ${r}`).join('\n')}`);
    }

    for (const [res, amount] of Object.entries(cost)) {
        const result = await changeUserField(BigInt(ctx.from.id), res as any, 'subtract', amount);
        if (result !== 'ok') return ctx.reply(`❌ خطا در کم کردن ${res}`);
    }
    const addResult = await changeUserField(BigInt(ctx.from.id), buyItem as any, 'add', qty);
    if (addResult !== 'ok') return ctx.reply(`❌ خطا در افزودن آیتم "${buyItem}" به موجودی.`);

    const label = more.armyLabels?.[buyCategory]?.[buyItem] || buyItem;
    await ctx.reply(
        `✅ خرید ${qty} عدد "${label}" انجام شد.\n` +
        `📉 منابع مصرف‌شده:\n` +
        Object.entries(cost)
            .map(([k, v]) => `• ${v} ${k === 'iron' ? 'آهن' : k === 'oil' ? 'نفت' : k === 'crowd' ? 'جمعیت' : k === 'capital' ? 'سرمایه' : k}`)
            .join('\n')
    );

    delete ctx.session.buyStep;
    delete ctx.session.buyCategory;
    delete ctx.session.buyItem;
});

export default shop;