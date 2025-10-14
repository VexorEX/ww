"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../prisma");
const telegraf_1 = require("telegraf");
const config_json_1 = __importDefault(require("../../config/config.json"));
const escape_1 = require("../../utils/escape");
const admin = new telegraf_1.Composer();
admin.action(/admin_approve_building_(\d+)/, async (ctx) => {
    const userId = BigInt(ctx.match[1]);
    const user = await prisma_1.prisma.user.findUnique({ where: { userid: userId } });
    if (!user || user.capital < 250000000) {
        return ctx.reply('❌ بودجه کافی ندارد.');
    }
    await prisma_1.prisma.user.update({
        where: { userid: userId },
        data: { capital: { decrement: 250000000 } }
    });
    await prisma_1.prisma.productionLine.create({
        data: {
            ownerId: userId,
            country: user.country,
            name: ctx.session?.carName,
            type: 'car',
            imageUrl: ctx.session?.carImage,
            dailyLimit: 15,
            setupCost: BigInt(250000000)
        }
    });
    await ctx.telegram.sendPhoto(config_json_1.default.channels.updates, ctx.session.carImage, {
        caption: (0, escape_1.escapeMarkdownV2)(`🏭 خط تولید جدید راه‌اندازی شد\n\n` +
            `> کشور سازنده: *${user.countryName}*\n` +
            `> محصول: *${ctx.session.carName}*\n\n` +
            `بودجه راه‌اندازی: 250M\nظرفیت تولید روزانه: 15 خودرو`),
        parse_mode: 'MarkdownV2'
    });
    await ctx.reply('✅ خط تولید ثبت شد و به کانال ارسال شد.');
});
