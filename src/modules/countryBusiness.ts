import { Composer, Markup } from 'telegraf';
import type { CustomContext } from '../middlewares/userAuth';
import { changeUserField } from './economy';
import { getCountryByName } from '../utils/countryUtils';
import { prisma } from '../prisma';
import config from '../config/config.json';
import countriesData from '../config/countries.json';

const business = new Composer<CustomContext>();

// یک Map موقتی برای ذخیره جزئیات انتقال‌ها (به جای session، چون session per-user است)
// در تولید، از Redis یا دیتابیس استفاده کنید
const pendingTrades = new Map<string, {
    senderId: bigint;
    receiverId: bigint;
    items: { type: string; amount: number }[];
    oilCost: number;
    resourcesDeducted: boolean;
    destination: string;
}>();

// لیست آیتم‌های غیرقابل انتقال
const nonTransferableFields: string[] = ['soldier', 'goldMine', 'uraniumMine', 'ironMine', 'refinery'];

// تعریف کلیدهای قابل انتقال و نام‌های نمایشی آنها
const transferableFields: { [key: string]: string } = {
    // منابع
    'oil': 'نفت',
    'iron': 'آهن',
    'gold': 'طلا',
    'uranium': 'اورانیوم',
    'capital': 'سرمایه',
    // ارتش پایه
    'tank': 'تانک',
    'heavyTank': 'تانک سنگین',
    // جنگنده‌ها
    'su57': 'Su-57',
    'f47': 'F-47',
    'f35': 'F-35',
    'j20': 'J-20',
    'f16': 'F-16',
    'f22': 'F-22',
    'am50': 'AM-50',
    'b2': 'B-2',
    'tu16': 'Tu-16',
    // پهپادها
    'espionageDrone': 'پهپاد جاسوسی',
    'suicideDrone': 'پهپاد انتحاری',
    'crossDrone': 'پهپاد کروز',
    'witnessDrone': 'پهپاد شاهد',
    // موشک‌ها
    'simpleRocket': 'موشک ساده',
    'crossRocket': 'موشک کروز',
    'dotTargetRocket': 'موشک نقطه‌زن',
    'continentalRocket': 'موشک قاره‌پیما',
    'ballisticRocket': 'موشک بالستیک',
    'chemicalRocket': 'موشک شیمیایی',
    'hyperSonicRocket': 'موشک هایپرسونیک',
    'clusterRocket': 'موشک خوشه‌ای',
    // کشتی‌های دریایی
    'battleship': 'ناو جنگی',
    'marineShip': 'کشتی دریایی',
    'breakerShip': 'کشتی بریک',
    'nuclearSubmarine': 'زیردریایی هسته‌ای',
    // دفاع
    'antiRocket': 'ضد موشک',
    'ironDome': 'گنبد آهنین',
    's400': 'S-400',
    's300': 'S-300',
    'taad': 'TAAD',
    'hq9': 'HQ-9',
    'acash': 'Akash'
};

// گروه‌بندی فیلدها بر اساس category برای مرتب‌سازی
const fieldCategories: { [key: string]: string[] } = {
    'منابع': ['oil', 'iron', 'gold', 'uranium', 'capital'],
    'ارتش پایه': ['tank', 'heavyTank'],
    'جنگنده‌ها': ['su57', 'f47', 'f35', 'j20', 'f16', 'f22', 'am50', 'b2', 'tu16'],
    'پهپادها': ['espionageDrone', 'suicideDrone', 'crossDrone', 'witnessDrone'],
    'موشک‌ها': ['simpleRocket', 'crossRocket', 'dotTargetRocket', 'continentalRocket', 'ballisticRocket', 'chemicalRocket', 'hyperSonicRocket', 'clusterRocket'],
    'کشتی‌های دریایی': ['battleship', 'marineShip', 'breakerShip', 'nuclearSubmarine'],
    'دفاع': ['antiRocket', 'ironDome', 's400', 's300', 'taad', 'hq9', 'acash']
};

// تابع دریافت کشورها بر اساس منطقه (با key و name) - مستقیم از JSON
function getCountriesByRegion(region: string, userCountry: string): { key: string; name: string }[] {
    const regionData = countriesData[region as keyof typeof countriesData];
    if (!regionData) return [];
    return Object.entries(regionData)
        .map(([key, c]: [string, any]) => ({ key, name: c.name }))
        .filter(country => country.name !== userCountry); // حذف کشور کاربر
}

// لیست مناطق
const regions = [
    { key: 'asia', name: 'آسیا 🌏' },
    { key: 'europe', name: 'اروپا 🌍' },
    { key: 'africa', name: 'آفریقا 🌍' },
    { key: 'america', name: 'آمریکا 🌎' },
    { key: 'australia', name: 'استرالیا 🌏' }
];

business.action('business', async (ctx) => {
    // بررسی وجود session
    if (!ctx.session) {
        ctx.session = {};
    }

    const user = ctx.user;

    // چک کردن منابع کافی
    const hasResources = Object.keys(transferableFields).some(field => !nonTransferableFields.includes(field) && Number(user[field as keyof typeof user]) > 0);
    if (!hasResources) {
        return ctx.reply('<blockquote>❌ شما هیچ منبعی برای انتقال ندارید.</blockquote>', { parse_mode: 'HTML' });
    }

    // ریست کردن session برای شروع انتقال جدید
    ctx.session.tradeStep = 'select_region';
    ctx.session.tradeItems = [];
    ctx.session.tradeOilCost = 0;

    // نمایش کیبورد مناطق
    const regionButtons = regions.map(r => Markup.button.callback(`"${r.name}"`, `select_region_${r.key}`));
    regionButtons.push(Markup.button.callback('❌ انصراف', 'cancel_trade'));

    await ctx.reply('<b>🌍 انتخاب کشور مقصد برای انتقال:</b>\n\n<blockquote>ابتدا منطقه مورد نظر را انتخاب کنید، سپس کشور مقصد را مشخص کنید.</blockquote>', {
        reply_markup: Markup.inlineKeyboard(regionButtons, { columns: 1 }).reply_markup,
        parse_mode: 'HTML'
    });
});

// هندلر انتخاب منطقه
regions.forEach(r => {
    business.action(`select_region_${r.key}`, async (ctx) => {
        // بررسی وجود session
        if (!ctx.session) {
            ctx.session = {};
        }

        ctx.session.selectedRegion = r.key;
        ctx.session.tradeStep = 'select_destination';

        // دریافت کشورها در منطقه (بدون کشور کاربر)
        const countries = getCountriesByRegion(r.key, ctx.user.countryName);
        if (countries.length === 0) {
            return ctx.reply(`<blockquote>❌ هیچ کشوری در منطقه ${r.name} در دسترس نیست.</blockquote>`, { parse_mode: 'HTML' });
        }

        const countryButtons = countries.map(country =>
            Markup.button.callback(`"${country.name}"`, `select_country_${country.key}`)
        );
        countryButtons.push(Markup.button.callback('❌ انصراف', 'cancel_trade'));

        await ctx.reply(`✅ <b>منطقه:</b> ${r.name}\n\n<b>🌍 انتخاب کشور مقصد:</b>\n\n<blockquote>کشور مورد نظر خود را انتخاب کنید.</blockquote>`, {
            reply_markup: Markup.inlineKeyboard(countryButtons, { columns: 2 }).reply_markup,
            parse_mode: 'HTML'
        });
    });
});

// هندلر انتخاب کشور مقصد (پس از انتخاب منطقه)
business.action(/^select_country_(.+)$/, async (ctx) => {
    // بررسی وجود session
    if (!ctx.session) {
        ctx.session = {};
    }

    if (ctx.session.tradeStep !== 'select_destination') return;

    const countryKey = ctx.match[1];
    // Lookup name from countriesData
    let countryName = '';
    for (const [reg, countries] of Object.entries(countriesData)) {
        const countryObj = (countries as any)[countryKey];
        if (countryObj) {
            countryName = countryObj.name;
            break;
        }
    }
    if (!countryName) {
        return ctx.reply('<blockquote>❌ کشور یافت نشد.</blockquote>', { parse_mode: 'HTML' });
    }

    ctx.session.destinationCountry = countryName;
    ctx.session.tradeStep = 'select_items';

    await ctx.reply(`✅ <b>کشور مقصد:</b> ${countryName}\n\n📦 <blockquote>حالا منابع مورد نظر برای انتقال را انتخاب کنید.</blockquote>`, {
        parse_mode: 'HTML'
    });

    // نمایش آیتم‌های قابل انتقال
    await showTradeItemsKeyboard(ctx);
});

// تابع نمایش کیبورد آیتم‌های قابل انتقال (مرتب‌شده بر اساس category)
async function showTradeItemsKeyboard(ctx: CustomContext) {
    // بررسی وجود session
    if (!ctx.session) {
        ctx.session = {};
    }

    const user = ctx.user;
    const buttons: any[] = [];

    // گروه‌بندی بر اساس category
    Object.entries(fieldCategories).forEach(([category, fields]) => {
        const categoryButtons = fields
            .filter(field => !nonTransferableFields.includes(field) && Number(user[field as keyof typeof user]) > 0)
            .map(field => Markup.button.callback(`"${transferableFields[field]} (${Number(user[field as keyof typeof user])})"`, `select_item_${field}`));

        if (categoryButtons.length > 0) {
            // هدر category (به عنوان متن، نه button) - برای سادگی، buttons رو مستقیم اضافه می‌کنم
            buttons.push(...categoryButtons);
        }
    });

    // اضافه کردن دکمه تأیید و ارسال
    if (ctx.session.tradeItems && ctx.session.tradeItems.length > 0) {
        buttons.push(Markup.button.callback('✅ تأیید و ارسال', 'confirm_trade'));
    }

    // اضافه کردن دکمه لغو
    buttons.push(Markup.button.callback('❌ انصراف', 'cancel_trade'));

    if (buttons.length === 1) { // فقط انصراف
        return ctx.reply('<blockquote>❌ شما هیچ منبعی برای انتقال ندارید.</blockquote>', { parse_mode: 'HTML' });
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
        await ctx.reply(`🔢 <blockquote>چند واحد <b>${transferableFields[field]}</b> می‌خواهید انتقال دهید؟\n(حداکثر: ${Number(ctx.user[field as keyof typeof ctx.user])})</blockquote>`, {
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

        if (!amount || amount <= 0 || amount > Number(user[field as keyof typeof user])) {
            return ctx.reply(`<blockquote>❌ مقدار نامعتبر یا بیشتر از موجودی شما (${Number(user[field as keyof typeof user])}) است.</blockquote>`, {
                parse_mode: 'HTML'
            });
        }

        // کسر فوری از کاربر
        await changeUserField(user.userid, field, 'subtract', amount);

        // ذخیره در لیست برای برگرداندن اگر cancel شد
        if (!ctx.session.deductedItems) {
            ctx.session.deductedItems = [];
        }
        ctx.session.deductedItems.push({ type: field, amount });

        // اضافه به لیست نمایش
        if (!ctx.session.tradeItems) {
            ctx.session.tradeItems = [];
        }
        ctx.session.tradeItems.push({ type: field, amount });
        ctx.session.tradeStep = 'select_items';
        ctx.session.selectedItem = null;

        // نمایش دوباره کیبورد بدون پیام اضافی
        await showTradeItemsKeyboard(ctx);
        return;
    }

    return next();
});

// هندلر تأیید اولیه (نمایش جزئیات)
business.action('confirm_trade', async (ctx) => {
    // بررسی وجود session
    if (!ctx.session) {
        ctx.session = {};
    }

    if (ctx.session.tradeStep !== 'select_items' || !ctx.session.tradeItems || ctx.session.tradeItems.length === 0) {
        return ctx.reply('<blockquote>❌ هیچ منبعی برای انتقال انتخاب نکرده‌اید.</blockquote>', { parse_mode: 'HTML' });
    }

    const user = ctx.user;
    const items = ctx.session.tradeItems;
    const destination = ctx.session.destinationCountry;

    // محاسبه هزینه نفت (پردازش انتقال)
    const oilCost = Math.floor(Math.random() * (60 - 35 + 1)) + 35;

    // کسر oil فوری
    await changeUserField(user.userid, 'oil', 'subtract', oilCost);

    // ذخیره در لیست برای برگرداندن
    if (!ctx.session.deductedItems) {
        ctx.session.deductedItems = [];
    }
    ctx.session.deductedItems.push({ type: 'oil', amount: oilCost });

    // ذخیره هزینه نفت برای استفاده بعد
    ctx.session.tradeOilCost = oilCost;
    ctx.session.tradeStep = 'confirm_details';

    // نمایش جزئیات انتقال
    const itemsList = items.map((item, index) => `${index + 1}. ${item.amount} واحد ${transferableFields[item.type]}`).join('\n');
    await ctx.reply(`<b>📋 جزئیات انتقال:</b>\n\n` +
        `<b>مقصد:</b> ${destination}\n\n` +
        `<b>محموله‌ها:</b>\n${itemsList}\n\n` +
        `<b>هزینه پردازش:</b> ${oilCost} نفت\n\n` +
        `<blockquote>⚠️ آیا این انتقال را تأیید می‌کنید؟</blockquote>`, {
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('✅ تأیید نهایی', 'final_confirm')],
            [Markup.button.callback('❌ انصراف', 'cancel_trade')]
        ]).reply_markup,
        parse_mode: 'HTML'
    });
});

// هندلر تأیید نهایی (فقط خبر، بدون کسر)
business.action('final_confirm', async (ctx) => {
    // بررسی وجود session
    if (!ctx.session) {
        ctx.session = {};
    }

    if (ctx.session.tradeStep !== 'confirm_details') return;

    const user = ctx.user;
    const items = ctx.session.tradeItems!;
    const oilCost = ctx.session.tradeOilCost!;
    const destination = ctx.session.destinationCountry!;
    const countryName = user.countryName;

    ctx.session.tradeStep = 'send_confirmation_to_destination';

    // خبر اولیه: انتقال در حال انجام
    const initialNews = `خبر فوری - انتقال\n<blockquote>1 محموله از کشور ${countryName} در حال انتقال است</blockquote>\nمقصد در گزارش بعدی معلوم می‌شود`;
    const randomImage = config.images.trade[Math.floor(Math.random() * config.images.trade.length)];
    await ctx.telegram.sendPhoto(config.channels.business, randomImage, {
        caption: initialNews,
        parse_mode: 'HTML'
    });

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
    const oilCost = ctx.session.tradeOilCost!;

    // پیدا کردن کاربران کشور مقصد
    const destinationUsers = await prisma.user.findMany({
        where: { countryName: destination },
        select: { userid: true }
    });

    if (destinationUsers.length === 0) {
        // اگر مقصد خالی، منابع رو برگردان
        if (ctx.session.deductedItems) {
            for (const item of ctx.session.deductedItems) {
                await changeUserField(user.userid, item.type, 'add', item.amount);
            }
        }
        return ctx.reply('<blockquote>❌ کشور مقصد کاربران فعالی ندارد. منابع بازگردانده شد.</blockquote>', { parse_mode: 'HTML' });
    }

    // کپی items برای جلوگیری از تداخل
    const copiedItems = [...items];

    // ارسال درخواست به همه کاربران کشور مقصد
    let confirmationsSent = 0;
    for (const destUser of destinationUsers) {
        try {
            const tradeId = `trade_${user.userid}_${destUser.userid}_${Date.now()}`;

            // کپی تازه برای هر کاربر
            const copiedItemsForUser = [...copiedItems];

            // ذخیره جزئیات انتقال در Map (موقتی)
            pendingTrades.set(tradeId, {
                senderId: user.userid,
                receiverId: destUser.userid,
                items: copiedItemsForUser,
                oilCost,
                resourcesDeducted: true,
                destination
            });

            const itemsList = copiedItemsForUser.map((item, index) => `${index + 1}. ${item.amount} واحد ${transferableFields[item.type]}`).join('\n');
            const message = `<b>📦 درخواست انتقال دریافتی</b>\n\n` +
                `<b>از کشور:</b> ${user.countryName}\n\n` +
                `<b>محموله‌ها:</b>\n${itemsList}\n\n` +
                `<blockquote>⚠️ آیا این انتقال را قبول می‌کنید؟ (رایگان)</blockquote>`;

            await ctx.telegram.sendMessage(Number(destUser.userid), message, {
                reply_markup: Markup.inlineKeyboard([
                    [Markup.button.callback('✅ قبول', `accept_trade_${tradeId}`), Markup.button.callback('❌ رد', `reject_trade_${tradeId}`)]
                ]).reply_markup,
                parse_mode: 'HTML'
            });
            confirmationsSent++;
        } catch (error) {
            if (error instanceof Error && error.message.includes('BadRequest: chat not found')) {
                console.log(`کاربر ${destUser.userid} ربات را بلاک کرده یا چت پیدا نشد`);
            } else {
                console.error(`Failed to send to user ${destUser.userid}:`, error);
            }
        }
    }

    if (confirmationsSent > 0) {
        await ctx.reply(`✅ <blockquote>درخواست انتقال به کشور ${destination} ارسال شد.</blockquote>\n\n⏳ <blockquote>منتظر پاسخ آنها باشید...</blockquote>`, {
            parse_mode: 'HTML'
        });
    } else {
        // اگر هیچی ارسال نشد، منابع رو برگردان
        if (ctx.session.deductedItems) {
            for (const item of ctx.session.deductedItems) {
                await changeUserField(user.userid, item.type, 'add', item.amount);
            }
        }
        await ctx.reply('<blockquote>❌ نتوانستم درخواست را ارسال کنم. منابع بازگردانده شد.</blockquote>', {
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
        return ctx.reply('<blockquote>❌ شما مجاز به قبول این انتقال نیستید.</blockquote>', { parse_mode: 'HTML' });
    }

    // بارگیری جزئیات انتقال از Map
    const tradeDetails = pendingTrades.get(tradeId);
    if (!tradeDetails) {
        return ctx.reply('<blockquote>❌ جزئیات انتقال یافت نشد.</blockquote>', { parse_mode: 'HTML' });
    }

    const senderUser = await prisma.user.findUnique({ where: { userid: senderId } });
    if (!senderUser) {
        return ctx.reply('<blockquote>❌ کاربر ارسال‌کننده یافت نشد.</blockquote>', { parse_mode: 'HTML' });
    }

    try {
        // ارسال تأیید به ارسال‌کننده
        await ctx.telegram.sendMessage(Number(senderId), `✅ <blockquote>کشور ${ctx.user.countryName} انتقال شما را قبول کرد!</blockquote>\n\n🚚 <blockquote>ارسال محموله‌ها آغاز می‌شود...</blockquote>`, { parse_mode: 'HTML' });
        // اطلاع‌رسانی به دریافت‌کننده
        await ctx.reply('<blockquote>✅ انتقال قبول شد. محموله‌ها در راه است!</blockquote>', { parse_mode: 'HTML' });

        // اجرای انتقال
        await executeTrade(ctx, tradeDetails, senderId, receiverId, tradeId);
    } catch (error) {
        console.log('Trade execution error:', error);
        await ctx.reply('<blockquote>❌ خطا در اجرای انتقال.</blockquote>', { parse_mode: 'HTML' });
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
        return ctx.reply('<blockquote>❌ جزئیات انتقال یافت نشد.</blockquote>', { parse_mode: 'HTML' });
    }

    const senderId = tradeDetails.senderId;

    try {
        await ctx.telegram.sendMessage(Number(senderId), `❌ <blockquote>کشور ${ctx.user.countryName} انتقال شما را رد کرد.</blockquote>`, { parse_mode: 'HTML' });
        await ctx.reply('<blockquote>❌ انتقال رد شد.</blockquote>', { parse_mode: 'HTML' });

        // اگر منابع کسر شد، برگردان + 50% نفت مالیات
        if (tradeDetails.resourcesDeducted) {
            for (const item of tradeDetails.items) {
                await changeUserField(senderId, item.type, 'add', item.amount);
            }
            const taxRefund = Math.floor(tradeDetails.oilCost * 1.5); // 100% + 50% مالیات
            await changeUserField(senderId, 'oil', 'add', taxRefund);
            await ctx.telegram.sendMessage(Number(senderId), `<blockquote>💰 منابع با 50% مالیات نفت بازگردانده شد.</blockquote>`, { parse_mode: 'HTML' });
        }

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
    resourcesDeducted: boolean;
    destination: string;
}, senderId: bigint, receiverId: bigint, tradeId: string) {
    const { items, destination } = tradeDetails;

    // اضافه کردن منابع به دریافت‌کننده (رایگان، بدون کسر)
    for (const item of items) {
        await changeUserField(receiverId, item.type, 'add', item.amount);
    }

    // ارسال محموله‌ها (فقط notify با delay، بدون add دوباره)
    await deliverTradeItems(ctx, items, receiverId, senderId, destination);

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
    ctx.session.selectedRegion = null;
    ctx.session.tradeOilCost = 0;
    await ctx.answerCbQuery('❌ انتقال لغو شد.');
    await ctx.deleteMessage(); // حذف پیام فعلی برای بستن پنل
});

async function deliverTradeItems(ctx: CustomContext, items: { type: string; amount: number }[], receiverId: bigint, senderId: bigint, destination: string) {
    const userId = Number(receiverId);
    const senderUserId = Number(senderId);

    // تحویل تک‌تک
    for (const item of items) {
        const { type, amount } = item;
        const delay = Math.floor(Math.random() * (180 - 120 + 1)) + 120;

        setTimeout(async () => {
            // فقط notify، add قبلاً در executeTrade انجام شد
            try {
                await ctx.telegram.sendMessage(userId, `<blockquote>📦 محموله ${amount} واحد ${transferableFields[type]} تحویل شد.</blockquote>`, { parse_mode: 'HTML' });
                // اختیاری: notify به sender هم
                await ctx.telegram.sendMessage(senderUserId, `<blockquote>📦 محموله ${amount} واحد ${transferableFields[type]} به مقصد تحویل شد.</blockquote>`, { parse_mode: 'HTML' });
            } catch (error) {
                console.error('Error sending delivery notification:', error);
            }
        }, delay * 1000);
    }

    // منتظر ماندن برای تحویل همه محموله‌ها (حداکثر delay)
    const maxDelay = 180 * 1000; // 180 ثانیه
    setTimeout(async () => {
        // ارسال خبر نهایی تحویل
        const senderUser = await prisma.user.findUnique({ where: { userid: senderId } });
        if (!senderUser) return;

        const country = getCountryByName(senderUser.countryName);
        const countryText = country?.name ?? senderUser.countryName;

        const newsTemplates = [
            `خبر فوری - تجاری ♨️

<blockquote>طبق گزارش خبرنگاران کشور‌های ${countryText} و ${destination} تجارت جدیدی داشتند. ↔️</blockquote>

<blockquote>محموله‌ها به صورت کاملاً سالم تحویل داده شدند. ✅</blockquote>

<blockquote>بار محموله معلوم نیست اما گمان‌هایی بر انتقال تسلیحات نظامی برآورد می‌شود. ⁉️</blockquote>`,
            `خبر فوری - تجاری ♨️

<blockquote>طبق گزارش خبرنگاران کشور‌های ${countryText} و ${destination} تجارت جدیدی داشتند. ↔️</blockquote>

<blockquote>محموله‌ها به صورت کاملاً سالم تحویل داده شدند. ✅</blockquote>

<blockquote>بار محموله معلوم نیست اما گمان‌هایی بر انتقال سرمایه رایج برآورد می‌شود. ⁉️</blockquote>`
        ];

        const selectedNews = newsTemplates[Math.floor(Math.random() * newsTemplates.length)];

        // انتخاب تصویر تصادفی از لیست
        const randomImage = config.images.trade[Math.floor(Math.random() * config.images.trade.length)];

        // تست URL با head request (اختیاری، برای چک اعتبار)
        try {
            const response = await fetch(randomImage, { method: 'HEAD' });
            if (response.ok && response.headers.get('content-type')?.startsWith('image/')) {
                await ctx.telegram.sendPhoto(config.channels.business, randomImage, {
                    caption: selectedNews,
                    parse_mode: 'HTML'
                });
            } else {
                // fallback به sendMessage اگر URL معتبر نیست
                await ctx.telegram.sendMessage(config.channels.business, selectedNews, {
                    parse_mode: 'HTML'
                });
            }
        } catch (urlError) {
            console.error('Image URL invalid:', randomImage, urlError);
            // fallback به sendMessage
            await ctx.telegram.sendMessage(config.channels.business, selectedNews, {
                parse_mode: 'HTML'
            });
        }
    }, maxDelay + 1000); // کمی بعد از آخرین تحویل
}

export default business;