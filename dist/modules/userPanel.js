"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUserStart = handleUserStart;
const telegraf_1 = require("telegraf");
const countryManagement_1 = __importDefault(require("./countryManagement"));
const countryShop_1 = __importDefault(require("./countryShop"));
const countryBuilding_1 = __importDefault(require("./countryBuilding"));
const countryState_1 = __importDefault(require("./countryState"));
const userPanel = new telegraf_1.Composer();
const userMainKeyboard = telegraf_1.Markup.inlineKeyboard([
    [telegraf_1.Markup.button.callback('📜 بیانیه', 'state')],
    [telegraf_1.Markup.button.callback('🛠 مدیریت کشور', 'management'), telegraf_1.Markup.button.callback('🛒 خرید', 'shop')],
    [telegraf_1.Markup.button.callback('─────────────', 'noop')],
    [telegraf_1.Markup.button.callback('🏗 ساخت و ساز', 'building')],
]);
const adminPanelKeyboard = telegraf_1.Markup.inlineKeyboard([
    [telegraf_1.Markup.button.callback('✏️ ویرایش دارایی', 'admin_editAssets'), telegraf_1.Markup.button.callback('🌪 بلای طبیعی', 'admin_disaster')],
    [telegraf_1.Markup.button.callback('🌐 سازمان ملل', 'admin_un')],
    [telegraf_1.Markup.button.callback('📰 روزنامه', 'admin_news'), telegraf_1.Markup.button.callback('📢 اعلان‌ها', 'admin_announcements')],
    [telegraf_1.Markup.button.callback('📊 آمار جهانی', 'admin_globalStats'), telegraf_1.Markup.button.callback('⛏ آمار منابع', 'admin_resourceStats'), telegraf_1.Markup.button.callback('📋 آمار عمومی', 'admin_publicStats')],
    [telegraf_1.Markup.button.callback('📣 پیام همگانی', 'admin_broadcast')],
    [telegraf_1.Markup.button.callback('─────────────', 'noop')],
    [telegraf_1.Markup.button.callback('🔙 بازگشت', 'admin_back'), telegraf_1.Markup.button.callback('❌ بستن', 'admin_close')],
]);
async function handleUserStart(ctx) {
    await ctx.reply(`🎮 خوش آمدی ${ctx.from.first_name}! کشور شما: ${ctx.user?.countryName}`, userMainKeyboard);
}
userPanel.use(countryManagement_1.default);
userPanel.use(countryShop_1.default);
userPanel.use(countryState_1.default);
userPanel.use(countryBuilding_1.default);
userPanel.action('back_main', async (ctx) => {
    const name = ctx.from.first_name;
    const country = ctx.user?.countryName || 'نامشخص';
    await ctx.editMessageText(`🎮 خوش آمدی ${name}! کشور شما: ${country}`, {
        reply_markup: userMainKeyboard.reply_markup
    });
    ctx.answerCbQuery();
});
userPanel.action('delete', async (ctx) => {
    try {
        await ctx.deleteMessage();
    }
    catch (err) {
        console.error('❌ خطا در حذف پیام:', err);
    }
    ctx.answerCbQuery();
});
exports.default = userPanel;
