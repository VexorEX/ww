import { Composer, Markup } from 'telegraf';
import type { CustomContext } from '../middlewares/userAuth';
import { changeUserField } from './economy';
import { escapeMarkdownV2 } from '../utils/escape';
import { getCountryByName } from '../utils/countryUtils';
import config from '../config/config.json';

const business = new Composer<CustomContext>();

const transferableFields = ['iron', 'gold', 'oil', 'uranium', 'capital'];

business.action('business', async (ctx) => {
    const user = ctx.user;
    const requiredOil = Math.floor(Math.random() * (60 - 35 + 1)) + 35;

    if (user.oil < requiredOil) {
        return ctx.reply(`❌ تجارت ممکن نیست. شما فقط ${user.oil} نفت دارید ولی ${requiredOil} نفت نیاز است.`);
    }

    await changeUserField(user.userid, 'oil', 'subtract', requiredOil);
    ctx.session.tradeStep = 'select_items';
    ctx.session.tradeItems = [];

    const handlePhotos = ['photo_handle_1_file_id', 'photo_handle_2_file_id'];
    const selectedHandle = handlePhotos[Math.floor(Math.random() * handlePhotos.length)];

    await ctx.replyWithPhoto(selectedHandle, {
        caption: 'نکات مهم تجارت 👇\nهر آیتم ۱ محموله است و زمان رسیدن بین ۲ تا ۳ دقیقه خواهد بود.'
    });

    const buttons = transferableFields
        .filter(field => user[field] > 0)
        .map(field => Markup.button.callback(`${field} (${user[field]})`, `select_item_${field}`));

    if (buttons.length === 0) {
        return ctx.reply('❌ شما هیچ آیتمی برای ارسال ندارید.');
    }

    buttons.push(Markup.button.callback('🚚 شروع ارسال محموله‌ها', 'confirm_trade'));
    buttons.push(Markup.button.callback('❌ انصراف', 'cancel_trade'));

    await ctx.reply('📦 انتخاب آیتم برای ارسال:', {
        reply_markup: Markup.inlineKeyboard(buttons, { columns: 2 }).reply_markup
    });
});

for (const field of transferableFields) {
    business.action(`select_item_${field}`, async (ctx) => {
        ctx.session.selectedItem = field;
        ctx.session.tradeStep = 'awaiting_quantity';
        await ctx.reply(`🔢 چند واحد ${field} می‌خواهید ارسال کنید؟`);
    });
}

business.on('text', async (ctx, next) => {
    if (ctx.session.tradeStep === 'awaiting_quantity') {
        const amount = parseInt(ctx.message.text.trim());
        const field = ctx.session.selectedItem;
        const user = ctx.user;

        if (!amount || amount <= 0 || amount > user[field]) {
            return ctx.reply(`❌ مقدار نامعتبر یا بیشتر از موجودی شما.`);
        }

        await changeUserField(user.userid, field, 'subtract', amount);
        ctx.session.tradeItems.push({ type: field, amount });
        ctx.session.tradeStep = 'select_items';
        ctx.session.selectedItem = null;

        return ctx.reply(`✅ ${amount} واحد ${field} ثبت شد. آیتم بعدی را انتخاب کنید یا دکمه "شروع ارسال" را بزنید.`);
    }

    return next();
});

business.action('cancel_trade', async (ctx) => {
    ctx.session.tradeStep = null;
    ctx.session.tradeItems = [];
    await ctx.reply('❌ تجارت لغو شد.');
});

business.action('confirm_trade', async (ctx) => {
    await ctx.reply('🚚 ارسال محموله‌ها آغاز شد...');
    await deliverTradeItems(ctx);
    ctx.session.tradeStep = null;
    ctx.session.tradeItems = [];
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
