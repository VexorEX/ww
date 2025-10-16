import { Composer, Markup } from 'telegraf';
import type { CustomContext } from '../middlewares/userAuth';
import { escapeMarkdownV2 } from '../utils/escape';
import { prisma } from '../prisma';
import config from '../config/config.json';
import { createProductionLine } from "./helper/Building";
import { changeCapital } from "./economy";
const admins: number[] = config.manage.buildings.admins;
const building = new Composer<CustomContext>();

// منوی اصلی ساخت‌وساز
building.action('building', async (ctx) => {
    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('🚗 خودروسازی', 'build_car')],
        [Markup.button.callback('🏙 شهرسازی ❌', 'NA')],
        [Markup.button.callback('🎬 فیلم‌سازی ❌', 'NA')],
        [Markup.button.callback('🎮 بازی‌سازی ❌', 'NA')],
        [Markup.button.callback('🔙 بازگشت', 'back_main'), Markup.button.callback('❌ بستن', 'delete')]
    ]);

    await ctx.reply('🏗 نوع ساخت‌وساز را انتخاب کن:', keyboard);
    ctx.answerCbQuery();
});

// شروع فرآیند ساخت خودرو
building.action('build_car', async (ctx) => {
    const userId = BigInt(ctx.from.id);
    const setupCost = 250_000_000;

    const user = await prisma.user.findUnique({ where: { userid: userId } });
    if (!user) return ctx.reply('❌ کاربر یافت نشد.');

    // بررسی محدودیت ساخت‌وساز روزانه
    ctx.session ??= {};
    if (ctx.session.buildingUsedToday) {
        return ctx.reply('⛔ شما امروز قبلاً ساخت‌وساز انجام داده‌اید. لطفاً فردا دوباره تلاش کنید.');
    }
    const today = new Date().toDateString();
    ctx.session ??= {};

    if (ctx.session.lastBuildDate === today) {
        return ctx.reply('⛔ شما امروز قبلاً ساخت‌وساز انجام داده‌اید. لطفاً فردا دوباره تلاش کنید.');
    }

    if (user.capital < setupCost) {
        return ctx.reply(`❌ بودجه کافی ندارید!\n💰 بودجه مورد نیاز: ${(setupCost / 1_000_000).toLocaleString()}M\n💳 بودجه فعلی شما: ${Number(user.capital / BigInt(1_000_000)).toLocaleString()}M`);
    }

    ctx.session ??= {};
    ctx.session.buildingType = 'car';
    ctx.session.buildingStep = 'awaiting_car_name';
    ctx.session.setupCost = setupCost;
    await ctx.reply('🚗 نام محصول خود را وارد کن:');
    ctx.answerCbQuery();
});

// دریافت نام خودرو
building.on('text', async (ctx, next) => {
    ctx.session ??= {};
    if (ctx.session.buildingStep === 'awaiting_car_name') {
        const name = ctx.message.text?.trim();
        if (!name || name.length < 2) {
            return ctx.reply('❌ نام محصول معتبر نیست. لطفاً دوباره وارد کن.');
        }

        ctx.session.carName = name;
        ctx.session.buildingStep = 'awaiting_car_image';
        await ctx.reply('🖼 حالا تصویر محصول را ارسال کن:');
    } else {
        return next();
    }

});

// دریافت تصویر خودرو و نمایش پیش‌نمایش
building.on('photo', async (ctx, next) => {
    ctx.session ??= {};
    if (ctx.session.buildingStep !== 'awaiting_car_image') return next();

    const photo = ctx.message.photo?.at(-1);
    if (!photo) return ctx.reply('❌ تصویر معتبر ارسال نشده.');

    const imageUrl = await ctx.telegram.getFileLink(photo.file_id);
    ctx.session.carImage = imageUrl.href;

    const preview = escapeMarkdownV2(
        `🏭 پیش‌نمایش خط تولید خودرو\n\n` +
        `> کشور سازنده: **${ctx.user?.countryName}**\n` +
        `> محصول: **${ctx.session.carName}**\n\n` +
        `بودجه راه‌اندازی: 250M\nظرفیت تولید روزانه: 15 خودرو\n\n` +
        `✅ اگر تأیید می‌کنی، دکمه زیر را بزن تا برای بررسی ادمین ارسال شود.`
    );

    const confirmKeyboard = Markup.inlineKeyboard([
        [Markup.button.callback('✅ ارسال برای تأیید ادمین', 'submit_building')],
        [Markup.button.callback('🔙 بازگشت', 'building')]
    ]);

    ctx.session.carImageFileId = photo.file_id;

    await ctx.replyWithPhoto(photo.file_id, {
        caption: preview,
        parse_mode: 'MarkdownV2',
        reply_markup: confirmKeyboard.reply_markup
    });


    ctx.session.buildingStep = 'awaiting_admin_review';
});

// ارسال درخواست به ادمین
building.action('submit_building', async (ctx) => {
    ctx.session ??= {};
    ctx.session.buildingUsedToday = true;
    ctx.session.lastBuildDate = new Date().toDateString();

    const { carName, carImage, carImageFileId, setupCost } = ctx.session;
    const countryName = ctx.user?.countryName;
    const userId = BigInt(ctx.from.id);

    if (!carName || !carImage || !carImageFileId || !countryName || !setupCost) {
        return ctx.reply('❌ اطلاعات ناقص است.');
    }

    // کسر پول با استفاده از changeCapital
    const result = await changeCapital(userId, 'subtract', setupCost);
    if (result === 'not_found') {
        return ctx.reply('❌ کاربر یافت نشد.');
    }
    if (result === 'invalid' || result === 'error') {
        return ctx.reply('❌ خطا در کسر پول.');
    }

    await prisma.pendingProductionLine.upsert({
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

    const adminKeyboard = Markup.inlineKeyboard([
        [Markup.button.callback('✅ تأیید ساخت', `admin_approve_building_${userId}`)],
        [Markup.button.callback('❌ رد درخواست', `admin_reject_building_${userId}`)]
    ]);

    for (const admin of admins) {
        await ctx.telegram.sendPhoto(admin, carImageFileId, {
            caption: escapeMarkdownV2(
                `📥 درخواست ساخت خط تولید خودرو\n\n` +
                `> کشور: **${countryName}**\n` +
                `> محصول: **${carName}**\n\n` +
                `بودجه: 250M\nظرفیت تولید روزانه: 15 خودرو`
            ),
            parse_mode: 'MarkdownV2',
            reply_markup: adminKeyboard.reply_markup
        });
    }

    await ctx.reply('📤 درخواست شما برای بررسی ادمین ارسال شد.');
    ctx.session.buildingStep = undefined;
});

// تأیید نهایی توسط ادمین
building.action(/admin_approve_building_(\d+)/, async (ctx) => {
    const userId = BigInt(ctx.match[1]);

    const user = await prisma.user.findUnique({ where: { userid: userId } });
    if (!user) return ctx.reply('❌ کاربر یافت نشد.');

    const pending = await prisma.pendingProductionLine.findUnique({ where: { ownerId: userId } });
    if (!pending) return ctx.reply('❌ اطلاعات محصول یافت نشد.');

    const result = await createProductionLine({
        ownerId: userId,
        country: pending.country,
        name: pending.name,
        type: pending.type,
        imageUrl: pending.imageUrl,
        dailyLimit: pending.dailyLimit,
        setupCost: pending.setupCost,
        carName: pending.name
    });

    if (result.error) return ctx.reply(result.error);

    await prisma.pendingProductionLine.delete({ where: { ownerId: userId } });

    await ctx.telegram.sendPhoto(config.channels.updates, pending.imageFileId, {
        caption: escapeMarkdownV2(
            `🏭 خط تولید جدید راه‌اندازی شد\n\n` +
            `> کشور سازنده: **${user.countryName}**\n` +
            `> محصول: **${pending.name}**\n\n` +
            `بودجه راه‌اندازی: ${pending.setupCost.toLocaleString()} ریال\n` +
            `ظرفیت تولید روزانه: ${pending.dailyLimit} واحد`
        ),
        parse_mode: 'MarkdownV2'
    });

    await ctx.reply('✅ خط تولید ثبت شد و به کانال ارسال شد.');
});

// رد درخواست توسط ادمین
building.action(/admin_reject_building_(\d+)/, async (ctx) => {
    const userId = BigInt(ctx.match[1]);
    const adminId = ctx.from.id;

    if (!admins.includes(adminId)) {
        return ctx.answerCbQuery('⛔ فقط ادمین می‌تونه رد کنه.');
    }


    const pending = await prisma.pendingProductionLine.findUnique({ where: { ownerId: userId } });
    if (!pending) {
        return ctx.answerCbQuery('❌ درخواست یافت نشد.');
    }

    // برگرداندن پول
    const result = await changeCapital(userId, 'add', Number(pending.setupCost));
    if (result === 'not_found') {
        return ctx.answerCbQuery('❌ کاربر یافت نشد.');
    }
    if (result === 'invalid' || result === 'error') {
        return ctx.answerCbQuery('❌ خطا در برگرداندن پول.');
    }

    // حذف درخواست
    await prisma.pendingProductionLine.delete({ where: { ownerId: userId } });

    // اطلاع‌رسانی به کاربر
    try {
        await ctx.telegram.sendMessage(Number(userId), 
            `❌ درخواست ساخت خط تولید شما رد شد.\n💰 مبلغ ${Number(pending.setupCost / BigInt(1_000_000)).toLocaleString()}M به حساب شما برگشت.`
        );
    } catch (err) {
        console.warn('ارسال پیام به PV کاربر ممکن نبود:', err);
    }

    await ctx.answerCbQuery('✅ درخواست رد شد و پول برگشت.');
});

export default building;
