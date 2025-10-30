import { Composer, Markup } from 'telegraf';
import type { CustomContext } from '../middlewares/userAuth';
import { changeUserField } from './economy';
import { escapeMarkdownV2 } from '../utils/escape';
import { getCountryByName, getAvailableCountriesList } from '../utils/countryUtils';
import { prisma } from '../prisma';
import config from '../config/config.json';

const business = new Composer<CustomContext>();

// یک Map موقتی برای ذخیره جزئیات انتقال‌ها (به جای session، چون session per-user است)
// در تولید، از Redis یا دیتابیس استفاده کنید
const pendingTrades = new Map<string, {
    senderId: bigint;
    receiverId: bigint;
    items: { type: string; amount: number }[];
    oilCost: number;
}>();

// تعریف کلیدهای قابل انتقال و نام‌های نمایشی آنها
const transferableFields: { [key: string]: string } = {
    'iron': 'آهن',
    'gold': 'طلا',
    'oil': 'نفت',
    'uranium': 'اورانیوم',
    'capital': 'سرمایه',
    'soldier': 'سرباز',
    'tank': 'تانک',
    'plane': 'هواپیما',
    'ship': 'کشتی',
    'missile': 'موشک',
    'nuclear': 'سلاح هسته‌ای',
    'satellite': 'ماهواره',
    'spies': 'جاسوس',
    'agents': 'عامل'
};

// لیست کشورها برای انتخاب مقصد (همیشه از util استفاده کن، بدون fallback محدود)
function loadAvailableCountries() {
    try {
        // استفاده از لیست کشور‌های موجود در بازی (با فیلتر خالی برای همه)
        const availableCountries = getAvailableCountriesList('');
        return availableCountries.map(country => country.name);
    } catch (error) {
        console.error('Error loading countries:', error);
        // بدون fallback محدود؛ اگر خطا، لیست خالی یا مدیریت در UI
        return [];
    }
}

business.action('business', async (ctx) => {
    // بررسی وجود session
    if (!ctx.session) {
        ctx.session = {};
    }

    const user = ctx.user;

    // چک کردن منابع کافی
    const hasResources = Object.keys(transferableFields).some(field => user[field] > 0);
    if (!hasResources) {
        return ctx.reply('❌ *شما هیچ منبعی برای انتقال ندارید.*', { parse_mode: 'MarkdownV2' });
    }

    // ریست کردن session برای شروع انتقال جدید
    ctx.session.tradeStep = 'select_destination';
    ctx.session.tradeItems = [];
    ctx.session.tradeOilCost = 0;

    // نمایش لیست کشورها برای انتخاب مقصد
    const countries = loadAvailableCountries();
    if (countries.length === 0) {
        return ctx.reply('❌ *هیچ کشوری برای انتقال در دسترس نیست.*', { parse_mode: 'MarkdownV2' });
    }
    const countryButtons = countries.map(country =>
        Markup.button.callback(`"${country}"`, `select_country_${country.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_')}`)
    );

    countryButtons.push(Markup.button.callback('❌ انصراف', 'cancel_trade'));

    await ctx.reply('<b>🌍 انتخاب کشور مقصد برای انتقال:</b>\n\n<blockquote>کشور مورد نظر خود را انتخاب کنید تا فرآیند انتقال آغاز شود.</blockquote>', {
        reply_markup: Markup.inlineKeyboard(countryButtons, { columns: 2 }).reply_markup,
        parse_mode: 'HTML'
    });
});

// هندلر انتخاب کشور مقصد
loadAvailableCountries().forEach(countryName => {
    const callbackData = `select_country_${countryName.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_')}`;
    business.action(callbackData, async (ctx) => {
        // بررسی وجود session
        if (!ctx.session) {
            ctx.session = {};
        }

        const user = ctx.user;
        ctx.session.destinationCountry = countryName;
        ctx.session.tradeStep = 'select_items';

        await ctx.reply(`✅ *کشور مقصد:* ${countryName}\n\n📦 <blockquote>حالا منابع مورد نظر برای انتقال را انتخاب کنید.</blockquote>`, {
            parse_mode: 'HTML'
        });

        // نمایش آیتم‌های قابل انتقال
        await showTradeItemsKeyboard(ctx);
    });
});

// تابع نمایش کیبورد آیتم‌های قابل انتقال
async function showTradeItemsKeyboard(ctx: CustomContext) {
    // بررسی وجود session
    if (!ctx.session) {
        ctx.session = {};
    }

    const user = ctx.user;
    const buttons = Object.keys(transferableFields)
        .filter(field => user[field] > 0)
        .map(field => Markup.button.callback(`"${transferableFields[field]} (${user[field]})"`, `select_item_${field}`));

    // اضافه کردن دکمه تأیید و ارسال
    if (ctx.session.tradeItems && ctx.session.tradeItems.length > 0) {
        buttons.push(Markup.button.callback('✅ تأیید و ارسال', 'confirm_trade'));
    }

    // اضافه کردن دکمه لغو
    buttons.push(Markup.button.callback('❌ انصراف', 'cancel_trade'));

    if (buttons.length === 1) { // فقط انصراف
        return ctx.reply('❌ *شما هیچ منبعی برای انتقال ندارید.*', { parse_mode: 'MarkdownV2' });
    }

    await ctx.reply('📦 <blockquote>منبع مورد نظر برای انتقال را انتخاب کنید:</blockquote>', {
        reply_markup: Markup.inlineKeyboard(buttons, { columns: 2 }).reply_markup,
        parse_mode: 'HTML'
    });
}

// هندلر انتخاب آیتم‌ها
Object.keys(transferableFields).forEach(field => {
    business.action(`select_item_${field}`, async (ctx) => {
        // بررسی وجود session
        if (!ctx.session) {
            ctx.session = {};
        }

        if (ctx.session.tradeStep !== 'select_items') return;

        ctx.session.selectedItem = field;
        ctx.session.tradeStep = 'awaiting_quantity';
        await ctx.reply(`🔢 <blockquote>چند واحد *${transferableFields[field]}* می‌خواهید انتقال دهید؟\n(حداکثر: ${ctx.user[field]})</blockquote>`, {
            parse_mode: 'HTML'
        });
    });
});

business.on('text', async (ctx, next) => {
    // بررسی وجود session
    if (!ctx.session) {
        ctx.session = {};
    }

    if (ctx.session.tradeStep === 'awaiting_quantity') {
        const amount = parseInt(ctx.message.text.trim());
        const field = ctx.session.selectedItem;
        const user = ctx.user;

        if (!amount || amount <= 0 || amount > user[field]) {
            return ctx.reply(`❌ <blockquote>مقدار نامعتبر یا بیشتر از موجودی شما (${user[field]}) است.</blockquote>`, {
                parse_mode: 'HTML'
            });
        }

        // اضافه کردن آیتم به لیست (هنوز کسر نمی‌کنیم)
        ctx.session.tradeItems!.push({ type: field, amount });
        ctx.session.tradeStep = 'select_items';
        ctx.session.selectedItem = null;

        await ctx.reply(`✅ <blockquote>${amount} واحد *${transferableFields[field]}* با موفقیت ثبت شد.</blockquote>\n\n📦 <blockquote>منبع دیگری انتخاب کنید یا "✅ تأیید و ارسال" را بزنید.</blockquote>`, {
            parse_mode: 'HTML'
        });

        // نمایش دوباره کیبورد
        await showTradeItemsKeyboard(ctx);
        return;
    }

    return next();
});

// هندلر تأیید نهایی انتقال (رایگان، بدون هزینه از مقصد)
business.action('confirm_trade', async (ctx) => {
    // بررسی وجود session
    if (!ctx.session) {
        ctx.session = {};
    }

    if (ctx.session.tradeStep !== 'select_items' || !ctx.session.tradeItems || ctx.session.tradeItems.length === 0) {
        return ctx.reply('❌ <blockquote>هیچ منبعی برای انتقال انتخاب نکرده‌اید.</blockquote>', { parse_mode: 'HTML' });
    }

    const user = ctx.user;
    const items = ctx.session.tradeItems;
    const destination = ctx.session.destinationCountry;

    // محاسبه هزینه نفت (پردازش انتقال)
    const oilCost = Math.floor(Math.random() * (60 - 35 + 1)) + 35;

    if (user.oil < oilCost) {
        return ctx.reply(`❌ <blockquote>نفت کافی برای پردازش انتقال ندارید. نیاز: ${oilCost} نفت</blockquote>`);
    }

    // ذخیره هزینه نفت برای استفاده بعد
    ctx.session.tradeOilCost = oilCost;
    ctx.session.tradeStep = 'send_confirmation_to_destination';

    // مستقیم ارسال به مقصد (رایگان)
    await sendTradeConfirmationToDestination(ctx);
});

// تابع ارسال تأیید به کشور مقصد (رایگان)
async function sendTradeConfirmationToDestination(ctx: CustomContext) {
    // بررسی وجود session
    if (!ctx.session) {
        ctx.session = {};
    }

    const user = ctx.user;
    const items = ctx.session.tradeItems!;
    const destination = ctx.session.destinationCountry!;
    const oilCost = ctx.session.tradeOilCost;

    // پیدا کردن کاربران کشور مقصد
    const destinationUsers = await prisma.user.findMany({
        where: { countryName: destination },
        select: { userid: true }
    });

    if (destinationUsers.length === 0) {
        return ctx.reply('❌ <blockquote>کشور مقصد کاربران فعالی ندارد.</blockquote>', { parse_mode: 'HTML' });
    }

    // ارسال درخواست به همه کاربران کشور مقصد
    let confirmationsSent = 0;
    for (const destUser of destinationUsers) {
        try {
            const tradeId = `trade_${user.userid}_${destUser.userid}_${Date.now()}`;

            // ذخیره جزئیات انتقال در Map (موقتی)
            pendingTrades.set(tradeId, {
                senderId: user.userid,
                receiverId: destUser.userid,
                items,
                oilCost
            });

            const itemsList = items.map((item, index) => `${index + 1}. ${item.amount} واحد ${transferableFields[item.type]}`).join('\n');
            const message = `<b>📦 درخواست انتقال دریافتی</b>\n\n` +
                `<b>از کشور:</b> ${user.countryName}\n` +
                `<b>هزینه پیشنهادی:</b> *رایگان*\n\n` +
                `<b>محموله‌ها:</b>\n${itemsList}\n\n` +
                `<blockquote>⚠️ آیا این انتقال را قبول می‌کنید؟ (بدون هیچ هزینه‌ای برای شما)</blockquote>`;

            await ctx.telegram.sendMessage(Number(destUser.userid), message, {
                reply_markup: Markup.inlineKeyboard([
                    [Markup.button.callback(`✅ قبول - ${tradeId}`, `accept_trade_${tradeId}`)],
                    [Markup.button.callback(`❌ رد - ${tradeId}`, `reject_trade_${tradeId}`)]
                ]).reply_markup,
                parse_mode: 'HTML'
            });

            confirmationsSent++;
        } catch (error) {
            // چک کردن اینکه آیا خطا مربوط به عدم دسترسی به کاربر است
            if (error instanceof Error && error.message.includes('BadRequest: chat not found')) {
                console.log(`کاربر ${destUser.userid} ربات را بلاک کرده یا چت پیدا نشد`);
            } else {
                console.log(`Failed to send to user ${destUser.userid}:`, error);
            }
        }
    }

    if (confirmationsSent > 0) {
        await ctx.reply(`✅ <blockquote>درخواست انتقال به ${confirmationsSent} کاربر از کشور ${destination} ارسال شد.</blockquote>\n\n⏳ <blockquote>منتظر پاسخ آنها باشید...</blockquote>`, {
            parse_mode: 'HTML'
        });
    } else {
        await ctx.reply('❌ <blockquote>نتوانستم درخواست را ارسال کنم. ممکن است کاربران مقصد ربات را بلاک کرده باشند.</blockquote>', {
            parse_mode: 'HTML'
        });
    }
}

// هندلر قبول انتقال توسط کشور مقصد
business.action(/^accept_trade_(trade_\d+_\d+_\d+)$/, async (ctx) => {
    // بررسی وجود session
    if (!ctx.session) {
        ctx.session = {};
    }

    const tradeId = ctx.match[1];
    const accepterId = BigInt(ctx.from.id);

    // استخراج اطلاعات از tradeId
    const parts = tradeId.split('_');
    const senderId = BigInt(parts[1]);
    const receiverId = BigInt(parts[2]);

    // بررسی اینکه آیا این کاربر مجاز به قبول است
    if (receiverId !== accepterId) {
        return ctx.reply('❌ <blockquote>شما مجاز به قبول این انتقال نیستید.</blockquote>', { parse_mode: 'HTML' });
    }

    // بارگیری جزئیات انتقال از Map
    const tradeDetails = pendingTrades.get(tradeId);
    if (!tradeDetails) {
        return ctx.reply('❌ <blockquote>جزئیات انتقال یافت نشد.</blockquote>', { parse_mode: 'HTML' });
    }

    const senderUser = await prisma.user.findUnique({ where: { userid: senderId } });
    if (!senderUser) {
        return ctx.reply('❌ <blockquote>کاربر ارسال‌کننده یافت نشد.</blockquote>', { parse_mode: 'HTML' });
    }

    try {
        // ارسال تأیید به ارسال‌کننده
        await ctx.telegram.sendMessage(Number(senderId), `✅ <blockquote>کشور ${ctx.user.countryName} انتقال شما را قبول کرد!</blockquote>\n\n🚚 <blockquote>ارسال محموله‌ها آغاز می‌شود...</blockquote>`, { parse_mode: 'HTML' });

        // اجرای انتقال
        await executeTrade(ctx, tradeDetails, senderId, receiverId, tradeId);
    } catch (error) {
        console.log('Trade execution error:', error);
        await ctx.reply('❌ <blockquote>خطا در اجرای انتقال.</blockquote>', { parse_mode: 'HTML' });
    }
});

// هندلر رد انتقال
business.action(/^reject_trade_(trade_\d+_\d+_\d+)$/, async (ctx) => {
    // بررسی وجود session
    if (!ctx.session) {
        ctx.session = {};
    }

    const tradeId = ctx.match[1];

    // بارگیری جزئیات برای senderId
    const tradeDetails = pendingTrades.get(tradeId);
    if (!tradeDetails) {
        return ctx.reply('❌ <blockquote>جزئیات انتقال یافت نشد.</blockquote>', { parse_mode: 'HTML' });
    }

    const senderId = tradeDetails.senderId;

    try {
        await ctx.telegram.sendMessage(Number(senderId), `❌ <blockquote>کشور ${ctx.user.countryName} انتقال شما را رد کرد.</blockquote>`, { parse_mode: 'HTML' });
        await ctx.reply('❌ <blockquote>انتقال رد شد.</blockquote>', { parse_mode: 'HTML' });

        // پاک کردن از pending
        pendingTrades.delete(tradeId);
    } catch (error) {
        console.log('Trade rejection error:', error);
    }
});

// تابع اجرای انتقال
async function executeTrade(ctx: CustomContext, tradeDetails: {
    items: { type: string; amount: number }[];
    oilCost: number;
}, senderId: bigint, receiverId: bigint, tradeId: string) {
    const { items, oilCost } = tradeDetails;

    // کسر منابع از ارسال‌کننده
    for (const item of items) {
        await changeUserField(senderId, item.type, 'subtract', item.amount);
    }
    await changeUserField(senderId, 'oil', 'subtract', oilCost);

    // اضافه کردن منابع به دریافت‌کننده (رایگان، بدون کسر)
    for (const item of items) {
        await changeUserField(receiverId, item.type, 'add', item.amount);
    }

    // ارسال محموله‌ها (فقط notify با delay، بدون add دوباره)
    await deliverTradeItems(ctx, items, receiverId, senderId);

    // پاک کردن از pending
    pendingTrades.delete(tradeId);
}

// هندلر انصراف (فقط ریست session، کیبورد می‌مونه برای استفاده مجدد)
business.action('cancel_trade', async (ctx) => {
    // بررسی وجود session
    if (!ctx.session) {
        ctx.session = {};
    }
    ctx.session.tradeStep = null;
    ctx.session.tradeItems = [];
    ctx.session.destinationCountry = null;
    ctx.session.tradeOilCost = 0;
    await ctx.reply('❌ <blockquote>انتقال لغو شد.</blockquote>', {
        parse_mode: 'HTML'
    });
});

async function deliverTradeItems(ctx: CustomContext, items: { type: string; amount: number }[], receiverId: bigint, senderId: bigint) {
    const userId = Number(receiverId);
    const senderUserId = Number(senderId);

    for (const item of items) {
        const { type, amount } = item;
        const delay = Math.floor(Math.random() * (180 - 120 + 1)) + 120;

        setTimeout(async () => {
            // فقط notify، add قبلاً در executeTrade انجام شده
            await ctx.telegram.sendMessage(userId, `📦 <blockquote>محموله ${amount} واحد ${transferableFields[type]} تحویل شد.</blockquote>`, { parse_mode: 'HTML' });
            // اختیاری: notify به sender هم
            await ctx.telegram.sendMessage(senderUserId, `📦 <blockquote>محموله ${amount} واحد ${transferableFields[type]} به مقصد تحویل شد.</blockquote>`, { parse_mode: 'HTML' });
        }, delay * 1000);
    }

    // ارسال خبر به کانال با تصویر
    const senderUser = await prisma.user.findUnique({ where: { userid: senderId } });
    if (!senderUser) return;

    const country = getCountryByName(senderUser.countryName);
    const countryText = country?.name ?? senderUser.countryName;

    const newsTemplates = [
        `خبر فوری - انتقال ♨️ طبق گزارش خبرنگاران کشور ${countryText} انتقال جدیدی داشت.\n↔️ محموله‌ها سالم تحویل شدند.\n✅ گمان‌هایی بر انتقال تسلیحات نظامی وجود دارد. ⁉️`,
        `خبر فوری - انتقال ♨️ طبق گزارش خبرنگاران کشور ${countryText} انتقال جدیدی داشت.\n↔️ محموله‌ها سالم تحویل شدند.\n✅ گمان‌هایی بر انتقال سرمایه رایج وجود دارد. ⁉️`
    ];

    const selectedNews = newsTemplates[Math.floor(Math.random() * newsTemplates.length)];
    // فرض: URL تصویر ثابت مرتبط با انتقال/تجارت
    const tradeImageUrl = 'https://example.com/trade-delivery.jpg'; // جایگزین با URL واقعی تصویر
    await ctx.telegram.sendPhoto(config.channels.business, tradeImageUrl, {
        caption: escapeMarkdownV2(selectedNews),
        parse_mode: 'MarkdownV2'
    });
}

export default business;