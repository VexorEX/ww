import { Composer, Markup } from 'telegraf';
import type { CustomContext } from '../middlewares/userAuth';
import { changeUserField } from './economy';
import { escapeMarkdownV2 } from '../utils/escape';
import { getCountryByName, getAvailableCountriesList } from '../utils/countryUtils';
import config from '../config/config.json';

const business = new Composer<CustomContext>();

const transferableFields = ['iron', 'gold', 'oil', 'uranium', 'capital'];

// لیست کشورها برای انتخاب مقصد
let availableCountries: string[] = [];

function loadAvailableCountries() {
    if (availableCountries.length === 0) {
        // لیست کشورهایی که در بازی فعال هستند
        availableCountries = ['ایران 🇮🇷', 'چین 🇨🇳', 'روسیه 🇷🇺', 'آمریکا 🇺🇸', 'انگلیس 🇬🇧', 'فرانسه 🇫🇷', 'آلمان 🇩🇪', 'ژاپن 🇯🇵', 'هند 🇮🇳', 'ترکیه 🇹🇷'];
    }
    return availableCountries;
}

business.action('business', async (ctx) => {
    const user = ctx.user;

    // ریست کردن session برای شروع تجارت جدید
    ctx.session.tradeStep = 'select_destination';
    ctx.session.tradeItems = [];
    ctx.session.tradeOilCost = 0;

    // نمایش لیست کشورها برای انتخاب مقصد
    const countries = loadAvailableCountries();
    const countryButtons = countries.map(country =>
        Markup.button.callback(country, `select_country_${country.replace(/[^a-zA-Z0-9]/g, '_')}`)
    );

    countryButtons.push(Markup.button.callback('❌ انصراف', 'cancel_trade'));

    await ctx.reply('<b>🌍 انتخاب کشور مقصد برای تجارت:</b>', {
        reply_markup: Markup.inlineKeyboard(countryButtons, { columns: 2 }).reply_markup,
        parse_mode: 'HTML'
    });
});

// هندلر انتخاب کشور مقصد
loadAvailableCountries().forEach(countryName => {
    const callbackData = `select_country_${countryName.replace(/[^a-zA-Z0-9]/g, '_')}`;
    business.action(callbackData, async (ctx) => {
        const user = ctx.user;
        ctx.session.destinationCountry = countryName;
        ctx.session.tradeStep = 'select_items';

        await ctx.reply(`✅ کشور مقصد: ${countryName}\n\n📦 حالا آیتم‌هایی که می‌خواهید ارسال کنید انتخاب کنید:`, {
            parse_mode: 'HTML'
        });

        // نمایش آیتم‌های قابل انتقال
        await showTradeItemsKeyboard(ctx);
    });
});

// تابع نمایش کیبورد آیتم‌های قابل انتقال
async function showTradeItemsKeyboard(ctx: CustomContext) {
    const user = ctx.user;
    const buttons = transferableFields
        .filter(field => user[field] > 0)
        .map(field => Markup.button.callback(`${field} (${user[field]})`, `select_item_${field}`));

    if (buttons.length === 0) {
        return ctx.reply('❌ شما هیچ آیتمی برای ارسال ندارید.');
    }

    await ctx.reply('📦 انتخاب آیتم برای ارسال:', {
        reply_markup: Markup.inlineKeyboard(buttons, { columns: 2 }).reply_markup,
        parse_mode: 'HTML'
    });
}

// هندلر انتخاب آیتم‌ها
for (const field of transferableFields) {
    business.action(`select_item_${field}`, async (ctx) => {
        if (ctx.session.tradeStep !== 'select_items') return;

        ctx.session.selectedItem = field;
        ctx.session.tradeStep = 'awaiting_quantity';
        await ctx.reply(`🔢 چند واحد ${field} می‌خواهید ارسال کنید؟ (حداکثر: ${ctx.user[field]})`, {
            parse_mode: 'HTML'
        });
    });
}
business.on('text', async (ctx, next) => {
    if (ctx.session.tradeStep === 'awaiting_quantity') {
        const amount = parseInt(ctx.message.text.trim());
        const field = ctx.session.selectedItem;
        const user = ctx.user;

        if (!amount || amount <= 0 || amount > user[field]) {
            return ctx.reply(`❌ مقدار نامعتبر یا بیشتر از موجودی شما (${user[field]}).`, {
                parse_mode: 'HTML'
            });
        }

        // اضافه کردن آیتم به لیست (هنوز کسر نمی‌کنیم)
        ctx.session.tradeItems.push({ type: field, amount });
        ctx.session.tradeStep = 'select_items';
        ctx.session.selectedItem = null;

        await ctx.reply(`✅ ${amount} واحد ${field} ثبت شد.\n\n📦 آیتم دیگری انتخاب کنید یا دکمه "✅ تأیید و ارسال" را بزنید.`, {
            parse_mode: 'HTML'
        });

        // نمایش دوباره کیبورد
        await showTradeItemsKeyboard(ctx);
        return;
    }

    return next();
});

// هندلر تأیید نهایی تجارت
business.action('confirm_trade', async (ctx) => {
    if (ctx.session.tradeStep !== 'select_items' || !ctx.session.tradeItems || ctx.session.tradeItems.length === 0) {
        return ctx.reply('❌ هیچ آیتمی برای ارسال انتخاب نکرده‌اید.');
    }

    const user = ctx.user;
    const items = ctx.session.tradeItems;
    const destination = ctx.session.destinationCountry;

    // محاسبه هزینه نفت (پردازش تجارت)
    const oilCost = Math.floor(Math.random() * (60 - 35 + 1)) + 35;

    if (user.oil < oilCost) {
        return ctx.reply(`❌ نفت کافی برای پردازش تجارت ندارید. نیاز: ${oilCost} نفت`);
    }

    // نمایش خلاصه تجارت برای تأیید نهایی
    let summary = `<b>📋 خلاصه تجارت</b>\n\n`;
    summary += `<b>مقصد:</b> ${destination}\n`;
    summary += `<b>هزینه پردازش:</b> ${oilCost} نفت\n\n`;
    summary += `<b>محموله‌ها:</b>\n`;

    items.forEach((item, index) => {
        summary += `${index + 1}. ${item.amount} واحد ${item.type}\n`;
    });

    summary += `\n<b>⚠️ آیا مطمئن هستید؟ پس از تأیید، منابع کسر خواهند شد.</b>`;

    await ctx.reply(summary, {
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('✅ تأیید نهایی', 'final_confirm_trade')],
            [Markup.button.callback('❌ انصراف', 'cancel_trade')]
        ]).reply_markup,
        parse_mode: 'HTML'
    });
});

// هندلر تأیید نهایی و اجرای تجارت
business.action('final_confirm_trade', async (ctx) => {
    const user = ctx.user;
    const items = ctx.session.tradeItems;
    const destination = ctx.session.destinationCountry;
    const oilCost = Math.floor(Math.random() * (60 - 35 + 1)) + 35;

    // کسر منابع
    for (const item of items) {
        await changeUserField(user.userid, item.type, 'subtract', item.amount);
    }
    await changeUserField(user.userid, 'oil', 'subtract', oilCost);

    await ctx.reply('🚚 ارسال محموله‌ها آغاز شد...', {
        parse_mode: 'HTML'
    });

    await deliverTradeItems(ctx);
    ctx.session.tradeStep = null;
    ctx.session.tradeItems = [];
    ctx.session.destinationCountry = null;
});

// هندلر انصراف (فقط ریست session، کیبورد می‌مونه برای استفاده مجدد)
business.action('cancel_trade', async (ctx) => {
    ctx.session.tradeStep = null;
    ctx.session.tradeItems = [];
    ctx.session.destinationCountry = null;
    ctx.session.tradeOilCost = 0;
    await ctx.reply('❌ تجارت لغو شد.', {
        parse_mode: 'HTML'
    });
});

async function deliverTradeItems(ctx: CustomContext) {
    const user = ctx.user;
    const items = ctx.session.tradeItems ?? [];

    for (const item of items) {
        const { type, amount } = item;
        const userId = Number(user.userid);
        const delay = Math.floor(Math.random() * (180 - 120 + 1)) + 120;

        setTimeout(async () => {
            await changeUserField(BigInt(userId), type, 'add', amount);
            await ctx.telegram.sendMessage(userId, `📦 محموله ${amount} واحد ${type} تحویل شد.`);
        }, delay * 1000);
    }

    const country = getCountryByName(user.countryName);
    const countryText = country?.name ?? user.countryName;

    const newsTemplates = [
        `خبر فوری - تجاری ♨️ طبق گزارش خبر نگاران کشور ${countryText} تجارت جدیدی داشت.\n↔️ محموله‌ها سالم تحویل شدند.\n✅ گمان‌هایی بر انتقال تسلیحات نظامی وجود دارد. ⁉️`,
        `خبر فوری - تجاری ♨️ طبق گزارش خبر نگاران کشور ${countryText} تجارت جدیدی داشت.\n↔️ محموله‌ها سالم تحویل شدند.\n✅ گمان‌هایی بر انتقال سرمایه رایج وجود دارد. ⁉️`
    ];

    const selectedNews = newsTemplates[Math.floor(Math.random() * newsTemplates.length)];
    await ctx.telegram.sendMessage(config.channels.business, escapeMarkdownV2(selectedNews), {
        parse_mode: 'MarkdownV2'
    });
}

export default business;
