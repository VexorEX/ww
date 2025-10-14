"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const shop = new telegraf_1.Composer();
const shopCategories = [
    { name: '🌍 زمینی', callback: 'buy_ground' },
    { name: '🌊 دریایی', callback: 'buy_marine' },
    { name: '✈️ هوایی', callback: 'buy_aerial' },
    { name: '🛡 دفاعی', callback: 'buy_defence' },
];
const shopActions = [
    { name: '🔙 بازگشت', callback: 'back_main' },
    { name: '❌ بستن', callback: 'delete' },
];
function chunk(arr, size) {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}
const keyboard = telegraf_1.Markup.inlineKeyboard([
    ...chunk(shopCategories, 2).map(pair => pair.map(c => telegraf_1.Markup.button.callback(c.name, c.callback))),
    shopActions.map(a => telegraf_1.Markup.button.callback(a.name, a.callback))
]);
shop.action('shop', async (ctx) => {
    await ctx.reply('🛒 دسته‌بندی فروشگاه را انتخاب کن:', keyboard);
    ctx.answerCbQuery();
});
exports.default = shop;
