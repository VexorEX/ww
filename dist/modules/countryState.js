"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const escape_1 = require("../utils/escape");
const config_json_1 = __importDefault(require("../config/config.json"));
const admins_json_1 = __importDefault(require("../config/admins.json"));
const economy_1 = require("./economy");
const state = new telegraf_1.Composer();
const isstateAdmin = (id) => admins_json_1.default.state.includes(id);
state.action('state', async (ctx) => {
    ctx.session ?? (ctx.session = {});
    ctx.session.awaitingstateImage = true;
    await ctx.reply('🖼 لطفاً تصویر بیانیه را ارسال کنید.');
    ctx.answerCbQuery();
});
state.on('photo', async (ctx, next) => {
    if (!ctx.session?.awaitingstateImage) {
        return next();
    }
    const photo = ctx.message.photo?.at(-1);
    if (!photo) {
        return ctx.reply('❌ تصویر معتبر دریافت نشد.');
    }
    ctx.session.stateImageFileId = photo.file_id;
    ctx.session.awaitingstateImage = false;
    ctx.session.awaitingstateText = true;
    await ctx.reply('✍️ حالا متن بیانیه را بنویسید (حداقل ۱۰۰ کاراکتر).');
});
state.on('text', async (ctx, next) => {
    if (!ctx.session?.awaitingstateText)
        return next();
    const text = ctx.message.text.trim();
    if (text.length < 100) {
        return await ctx.reply('❌ متن بیانیه باید حداقل ۱۰۰ کاراکتر باشد.');
    }
    ctx.session.stateText = text;
    ctx.session.awaitingstateText = false;
    const quotedText = (0, escape_1.escapeMarkdownV2)(ctx.session.stateText
        .split('\n')
        .map(line => `> ${line}`)
        .join('\n'));
    const preview = `
📣 *بیانیه رسمی*
صادر شده از سوی دولت *${ctx.user?.countryName}* 📝

━━━━━━━━━━━━━━━━━━━━━━━

${quotedText}

━━━━━━━━━━━━━━━━━━━━━━━

از طرف: ${ctx.from.username ? `@${(0, escape_1.escapeMarkdownV2)(ctx.from.username)}` : `ID: ${ctx.from.id}`}
`;
    const confirmKeyboard = telegraf_1.Markup.inlineKeyboard([
        [telegraf_1.Markup.button.callback('✅ تأیید و ارسال', 'confirm_state')],
        [telegraf_1.Markup.button.callback('❌ لغو', 'cancel_state')]
    ]);
    await ctx.replyWithPhoto(ctx.session.stateImageFileId, {
        caption: preview,
        parse_mode: 'MarkdownV2',
        reply_markup: confirmKeyboard.reply_markup
    });
});
state.action('confirm_state', async (ctx) => {
    const { stateImageFileId, stateText } = ctx.session ?? {};
    const senderId = ctx.from.id;
    const stateActionsKeyboard = telegraf_1.Markup.inlineKeyboard([
        [telegraf_1.Markup.button.callback('🗑 حذف بیانیه', `delete_state_${senderId}`),
            telegraf_1.Markup.button.callback('💸 جریمه', `fine_state_${senderId}`)]
    ]);
    if (!stateImageFileId || !stateText || !ctx.user?.countryName) {
        return ctx.answerCbQuery('❌ اطلاعات ناقص است!');
    }
    const quotedText = (0, escape_1.escapeMarkdownV2)(ctx.session.stateText
        .split('\n')
        .map(line => `> ${line}`)
        .join('\n'));
    const finalText = `
📣 *بیانیه رسمی*
صادر شده از سوی دولت *${ctx.user?.countryName}* 📝

━━━━━━━━━━━━━━━━━━━━━━━

${quotedText}

━━━━━━━━━━━━━━━━━━━━━━━

از طرف: ${ctx.from.username ? `@${(0, escape_1.escapeMarkdownV2)(ctx.from.username)}` : `ID: ${ctx.from.id}`}
`;
    try {
        const sent = await ctx.telegram.sendPhoto(config_json_1.default.channels.state, stateImageFileId, {
            caption: finalText,
            reply_markup: stateActionsKeyboard.reply_markup,
            parse_mode: 'MarkdownV2'
        });
        ctx.session.laststateMessageId = sent.message_id;
        await ctx.reply('✅ بیانیه شما با موفقیت ارسال شد.');
    }
    catch (err) {
        console.error('خطا در ارسال بیانیه:', err);
        await ctx.reply('❌ خطا در ارسال بیانیه. لطفاً دوباره تلاش کنید.');
        return ctx.answerCbQuery('❌ خطا در ارسال بیانیه');
    }
    ctx.session.stateImageFileId = undefined;
    ctx.session.stateText = undefined;
    ctx.session.awaitingstateImage = false;
    ctx.session.awaitingstateText = false;
    ctx.answerCbQuery();
});
state.action('cancel_state', async (ctx) => {
    ctx.session.stateImageFileId = undefined;
    ctx.session.stateText = undefined;
    ctx.session.awaitingstateImage = false;
    ctx.session.awaitingstateText = false;
    await ctx.reply('❌ ارسال بیانیه لغو شد.');
    ctx.answerCbQuery();
});
state.action(/fine_state_(\d+)/, async (ctx) => {
    const senderId = BigInt(ctx.match[1]);
    const adminId = ctx.from.id;
    if (!isstateAdmin(adminId)) {
        return ctx.answerCbQuery('⛔ فقط ادمین بیانیه می‌تونه جریمه کنه.');
    }
    const fineAmount = Math.round(300 + Math.random() * 200);
    const result = await (0, economy_1.changeCapital)(senderId, 'subtract', fineAmount * 1000000);
    if (result === 'not_found') {
        return ctx.answerCbQuery('❌ کاربر یافت نشد.');
    }
    if (result === 'invalid' || result === 'error') {
        return ctx.answerCbQuery('❌ خطا در اعمال جریمه.');
    }
    try {
        await ctx.telegram.sendMessage(Number(senderId), `💸 شما توسط ادمین بیانیه جریمه شدید به مبلغ ${fineAmount}M. از سرمایه شما کسر شد.`);
    }
    catch (err) {
        console.warn('ارسال پیام جریمه به PV کاربر ممکن نبود:', err);
    }
    await ctx.answerCbQuery(`✅ جریمه ${fineAmount}M اعمال شد.`);
});
state.action(/delete_state_(\d+)/, async (ctx) => {
    const senderId = Number(ctx.match[1]);
    const requesterId = ctx.from.id;
    const messageId = ctx.callbackQuery.message?.message_id;
    if (!messageId) {
        return ctx.answerCbQuery('❌ پیام قابل شناسایی نیست.');
    }
    if (requesterId !== senderId && !isstateAdmin(requesterId)) {
        return ctx.answerCbQuery('⛔ فقط ارسال‌کننده یا ادمین می‌تونه حذف کنه.');
    }
    try {
        await ctx.telegram.deleteMessage(config_json_1.default.channels.state, messageId);
    }
    catch (err) {
        console.error('خطا در حذف پیام:', err);
        return ctx.answerCbQuery('❌ حذف پیام ممکن نبود.');
    }
    const msg = requesterId === senderId
        ? '✅ بیانیه توسط خودتان حذف شد.'
        : '✅ بیانیه توسط ادمین حذف شد.';
    await ctx.answerCbQuery(msg);
    const notifyText = requesterId === senderId
        ? '📢 بیانیه‌ای که ارسال کرده بودی توسط خودت حذف شد.'
        : '📢 بیانیه‌ای که ارسال کرده بودی توسط ادمین حذف شد.';
    try {
        await ctx.telegram.sendMessage(senderId, notifyText);
    }
    catch (err) {
        console.warn('ارسال پیام به PV کاربر ممکن نبود:', err);
    }
});
exports.default = state;
