"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const escape_1 = require("../utils/escape");
const prisma_1 = require("../prisma");
const config_json_1 = __importDefault(require("../config/config.json"));
const admins_json_1 = __importDefault(require("../config/admins.json"));
const Building_1 = require("./helper/Building");
const economy_1 = require("./economy");
const building = new telegraf_1.Composer();
building.action('building', async (ctx) => {
    const keyboard = telegraf_1.Markup.inlineKeyboard([
        [telegraf_1.Markup.button.callback('🚗 خودروسازی', 'build_car')],
        [telegraf_1.Markup.button.callback('🏙 شهرسازی ❌', 'NA')],
        [telegraf_1.Markup.button.callback('🎬 فیلم‌سازی ❌', 'NA')],
        [telegraf_1.Markup.button.callback('🎮 بازی‌سازی ❌', 'NA')],
        [telegraf_1.Markup.button.callback('🔙 بازگشت', 'back_main'), telegraf_1.Markup.button.callback('❌ بستن', 'delete')]
    ]);
    await ctx.reply('🏗 نوع ساخت‌وساز را انتخاب کن:', keyboard);
    ctx.answerCbQuery();
});
building.action('build_car', async (ctx) => {
    const userId = BigInt(ctx.from.id);
    const setupCost = 250000000;
    const user = await prisma_1.prisma.user.findUnique({ where: { userid: userId } });
    if (!user) {
        return ctx.reply('❌ کاربر یافت نشد.');
    }
    if (user.capital < setupCost) {
        return ctx.reply(`❌ بودجه کافی ندارید!\n💰 بودجه مورد نیاز: ${(setupCost / 1000000).toLocaleString()}M\n💳 بودجه فعلی شما: ${Number(user.capital / BigInt(1000000)).toLocaleString()}M`);
    }
    ctx.session ?? (ctx.session = {});
    ctx.session.buildingType = 'car';
    ctx.session.buildingStep = 'awaiting_car_name';
    ctx.session.setupCost = setupCost;
    await ctx.reply('🚗 نام محصول خود را وارد کن:');
    ctx.answerCbQuery();
});
building.on('text', async (ctx, next) => {
    if (ctx.session.buildingStep === 'awaiting_car_name') {
        const name = ctx.message.text?.trim();
        if (!name || name.length < 2) {
            return ctx.reply('❌ نام محصول معتبر نیست. لطفاً دوباره وارد کن.');
        }
        ctx.session.carName = name;
        ctx.session.buildingStep = 'awaiting_car_image';
        await ctx.reply('🖼 حالا تصویر محصول را ارسال کن:');
    }
    else {
        return next();
    }
});
building.on('photo', async (ctx, next) => {
    if (ctx.session.buildingStep !== 'awaiting_car_image')
        return next();
    const photo = ctx.message.photo?.at(-1);
    if (!photo)
        return ctx.reply('❌ تصویر معتبر ارسال نشده.');
    const imageUrl = await ctx.telegram.getFileLink(photo.file_id);
    ctx.session.carImage = imageUrl.href;
    const preview = (0, escape_1.escapeMarkdownV2)(`🏭 پیش‌نمایش خط تولید خودرو\n\n` +
        `> کشور سازنده: **${ctx.user?.countryName}**\n` +
        `> محصول: **${ctx.session.carName}**\n\n` +
        `بودجه راه‌اندازی: 250M\nظرفیت تولید روزانه: 15 خودرو\n\n` +
        `✅ اگر تأیید می‌کنی، دکمه زیر را بزن تا برای بررسی ادمین ارسال شود.`);
    const confirmKeyboard = telegraf_1.Markup.inlineKeyboard([
        [telegraf_1.Markup.button.callback('✅ ارسال برای تأیید ادمین', 'submit_building')],
        [telegraf_1.Markup.button.callback('🔙 بازگشت', 'building')]
    ]);
    ctx.session.carImageFileId = photo.file_id;
    await ctx.replyWithPhoto(photo.file_id, {
        caption: preview,
        parse_mode: 'MarkdownV2',
        reply_markup: confirmKeyboard.reply_markup
    });
    ctx.session.buildingStep = 'awaiting_admin_review';
});
building.action('submit_building', async (ctx) => {
    const { carName, carImage, carImageFileId, setupCost } = ctx.session;
    const countryName = ctx.user?.countryName;
    const userId = BigInt(ctx.from.id);
    if (!carName || !carImage || !carImageFileId || !countryName || !setupCost) {
        return ctx.reply('❌ اطلاعات ناقص است.');
    }
    const result = await (0, economy_1.changeCapital)(userId, 'subtract', setupCost);
    if (result === 'not_found') {
        return ctx.reply('❌ کاربر یافت نشد.');
    }
    if (result === 'invalid' || result === 'error') {
        return ctx.reply('❌ خطا در کسر پول.');
    }
    await prisma_1.prisma.pendingProductionLine.upsert({
        where: { ownerId: userId },
        update: {
            name: carName,
            type: 'car',
            imageUrl: carImage,
            imageFileId: carImageFileId,
            dailyLimit: 15,
            setupCost: BigInt(setupCost),
            country: countryName
        },
        create: {
            ownerId: userId,
            name: carName,
            type: 'car',
            imageUrl: carImage,
            imageFileId: carImageFileId,
            dailyLimit: 15,
            setupCost: BigInt(setupCost),
            country: countryName
        }
    });
    const adminKeyboard = telegraf_1.Markup.inlineKeyboard([
        [telegraf_1.Markup.button.callback('✅ تأیید ساخت', `admin_approve_building_${userId}`)],
        [telegraf_1.Markup.button.callback('❌ رد درخواست', `admin_reject_building_${userId}`)]
    ]);
    await ctx.telegram.sendPhoto(admins_json_1.default.buildings, carImageFileId, {
        caption: (0, escape_1.escapeMarkdownV2)(`📥 درخواست ساخت خط تولید خودرو\n\n` +
            `> کشور: **${countryName}**\n` +
            `> محصول: **${carName}**\n\n` +
            `بودجه: 250M\nظرفیت تولید روزانه: 15 خودرو`),
        parse_mode: 'MarkdownV2',
        reply_markup: adminKeyboard.reply_markup
    });
    await ctx.reply('📤 درخواست شما برای بررسی ادمین ارسال شد.');
    ctx.session.buildingStep = undefined;
});
building.action(/admin_approve_building_(\d+)/, async (ctx) => {
    const userId = BigInt(ctx.match[1]);
    const user = await prisma_1.prisma.user.findUnique({ where: { userid: userId } });
    if (!user)
        return ctx.reply('❌ کاربر یافت نشد.');
    const pending = await prisma_1.prisma.pendingProductionLine.findUnique({ where: { ownerId: userId } });
    if (!pending)
        return ctx.reply('❌ اطلاعات محصول یافت نشد.');
    const result = await (0, Building_1.createProductionLine)({
        ownerId: userId,
        country: pending.country,
        name: pending.name,
        type: pending.type,
        imageUrl: pending.imageUrl,
        dailyLimit: pending.dailyLimit,
        setupCost: pending.setupCost,
        carName: pending.name
    });
    if (result.error)
        return ctx.reply(result.error);
    await prisma_1.prisma.pendingProductionLine.delete({ where: { ownerId: userId } });
    await ctx.telegram.sendPhoto(config_json_1.default.channels.updates, pending.imageFileId, {
        caption: (0, escape_1.escapeMarkdownV2)(`🏭 خط تولید جدید راه‌اندازی شد\n\n` +
            `> کشور سازنده: **${user.countryName}**\n` +
            `> محصول: **${pending.name}**\n\n` +
            `بودجه راه‌اندازی: ${pending.setupCost.toLocaleString()} ریال\n` +
            `ظرفیت تولید روزانه: ${pending.dailyLimit} واحد`),
        parse_mode: 'MarkdownV2'
    });
    await ctx.reply('✅ خط تولید ثبت شد و به کانال ارسال شد.');
});
building.action(/admin_reject_building_(\d+)/, async (ctx) => {
    const userId = BigInt(ctx.match[1]);
    const adminId = ctx.from.id;
    if (admins_json_1.default.buildings !== adminId) {
        return ctx.answerCbQuery('⛔ فقط ادمین می‌تونه رد کنه.');
    }
    const pending = await prisma_1.prisma.pendingProductionLine.findUnique({ where: { ownerId: userId } });
    if (!pending) {
        return ctx.answerCbQuery('❌ درخواست یافت نشد.');
    }
    const result = await (0, economy_1.changeCapital)(userId, 'add', Number(pending.setupCost));
    if (result === 'not_found') {
        return ctx.answerCbQuery('❌ کاربر یافت نشد.');
    }
    if (result === 'invalid' || result === 'error') {
        return ctx.answerCbQuery('❌ خطا در برگرداندن پول.');
    }
    await prisma_1.prisma.pendingProductionLine.delete({ where: { ownerId: userId } });
    try {
        await ctx.telegram.sendMessage(Number(userId), `❌ درخواست ساخت خط تولید شما رد شد.\n💰 مبلغ ${Number(pending.setupCost / BigInt(1000000)).toLocaleString()}M به حساب شما برگشت.`);
    }
    catch (err) {
        console.warn('ارسال پیام به PV کاربر ممکن نبود:', err);
    }
    await ctx.answerCbQuery('✅ درخواست رد شد و پول برگشت.');
});
exports.default = building;
