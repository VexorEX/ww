"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const prisma_1 = require("../prisma");
const userPanel_1 = require("../modules/userPanel");
const userAuth = async (ctx, next) => {
    const userId = ctx.from?.id;
    if (!userId)
        return await next();
    try {
        const user = await prisma_1.prisma.user.findUnique({ where: { userid: userId } });
        if (user) {
            ctx.user = user;
            if (!user.country) {
                await ctx.reply('🌍 شما هنوز کشوری ندارید!\nبرای شروع بازی باید داوطلب شوید و کشور دریافت کنید.', telegraf_1.Markup.inlineKeyboard([
                    telegraf_1.Markup.button.callback('✅ داوطلب شدن', 'getCountry')
                ]));
                return;
            }
            if (ctx.text === '/start') {
                await (0, userPanel_1.handleUserStart)(ctx);
                return;
            }
        }
        else {
            ctx.user = undefined;
        }
    }
    catch (error) {
        console.error('❌ خطا در بررسی کاربر:', error);
        ctx.user = undefined;
    }
    await next();
};
exports.default = userAuth;
