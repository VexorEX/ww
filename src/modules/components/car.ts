import { Composer, Markup } from 'telegraf';
import type { CustomContext } from '../../middlewares/userAuth';
import { escapeMarkdownV2 } from '../../utils/escape';
import { prisma } from '../../prisma';
import config from '../../config/config.json';
import { changeCapital } from '../economy';

const admins: number[] = config.manage.buildings.car.admins;
const car = new Composer<CustomContext>();

car.action('build_car', async (ctx) => {
    ctx.session = {
        buildingType: 'car',
        setupCost: 250_000_000,
        buildingStep: 'awaiting_name'
    };
    await ctx.reply('📌 نام پروژه خودرو را وارد کن:');
    ctx.answerCbQuery();
});

// دریافت نام پروژه
car.on('text', async (ctx, next) => {
    ctx.session ??= {};

    if (ctx.session.buildingStep === 'awaiting_setup_cost') {
        const raw = ctx.message.text?.trim();
        const cost = Number(raw.replace(/[^\d]/g, ''));
        if (isNaN(cost) || cost < 55_000_000 || cost > 750_000_000) {
            return ctx.reply('❌ عدد معتبر نیست. لطفاً عددی بین 55 تا 750 میلیون وارد کن.');
        }

        const userId = BigInt(ctx.from.id);
        const user = await prisma.user.findUnique({ where: { userid: userId } });
        if (!user) return ctx.reply('❌ کاربر یافت نشد.');

        if (user.capital < BigInt(cost)) {
            return ctx.reply(
                `❌ بودجه کافی ندارید!\n` +
                `💰 سرمایه مورد نیاز: ${(cost / 1_000_000).toLocaleString()}M\n` +
                `💳 سرمایه فعلی شما: ${Number(user.capital / BigInt(1_000_000)).toLocaleString()}M`
            );
        }

        ctx.session.setupCost = cost;
        ctx.session.buildingStep = 'awaiting_name';
        await ctx.reply('📌 نام پروژه را وارد کن:');
        return;
    }

    if (ctx.session.buildingStep === 'awaiting_name') {
        const name = ctx.message.text?.trim();
        if (!name || name.length < 2) return ctx.reply('❌ نام محصول معتبر نیست.');

        ctx.session.buildingName = name;
        ctx.session.buildingStep = 'awaiting_image';
        await ctx.reply('🖼 حالا تصویر محصول را ارسال کن:');
        return;
    }

    if (ctx.session.buildingStep === 'awaiting_build_description') {
        const description = ctx.message.text?.trim();
        if (!description || description.length < 5) return ctx.reply('❌ توضیح خیلی کوتاهه.');

        ctx.session.buildingDescription = description;
        ctx.session.buildingStep = 'awaiting_admin_review';

        const preview = escapeMarkdownV2(
            `🏭 پیش‌نمایش ساخت ${ctx.session.buildingType === 'car' ? 'خودرو' : `پروژه ${ctx.session.buildingType}`}\n\n` +
            `> کشور سازنده: *${ctx.user?.countryName}*\n` +
            `> محصول: *${ctx.session.buildingName}*\n` +
            `> توضیح: ${ctx.session.buildingDescription}\n\n` +
            `بودجه راه‌اندازی: ${Math.floor(ctx.session.setupCost / 1_000_000)}M\n` +
            (ctx.session.buildingType === 'car' ? 'ظرفیت تولید روزانه: 15 خودرو\n\n' : '') +
            `✅ اگر تأیید می‌کنی، دکمه زیر را بزن تا برای بررسی ادمین ارسال شود.`
        );

        const keyboard = Markup.inlineKeyboard([
            [Markup.button.callback('✅ ارسال برای تأیید ادمین', 'submit_building')],
            [Markup.button.callback('🔙 بازگشت', 'building')]
        ]);

        await ctx.replyWithPhoto(ctx.session.buildingImageFileId, {
            caption: preview,
            parse_mode: 'MarkdownV2',
            reply_markup: keyboard.reply_markup
        });
        return;
    }

    return next();
});

// دریافت تصویر
car.on('photo', async (ctx, next) => {
    ctx.session ??= {};
    if (ctx.session.buildingStep !== 'awaiting_image') return next();

    const photo = ctx.message.photo?.at(-1);
    if (!photo) return ctx.reply('❌ تصویر معتبر ارسال نشده.');

    const imageUrl = await ctx.telegram.getFileLink(photo.file_id);
    ctx.session.buildingImage = imageUrl.href;
    ctx.session.buildingImageFileId = photo.file_id;
    ctx.session.buildingStep = 'awaiting_build_description';

    await ctx.reply('📝 توضیحی درباره محصولت بنویس (مثلاً ویژگی‌ها یا هدف تولید):');
});

// ارسال درخواست به ادمین
car.action('submit_building', async (ctx) => {
    ctx.session ??= {};
    const { buildingType, buildingName, buildingImageFileId, buildingDescription, setupCost } = ctx.session;
    const userId = BigInt(ctx.from.id);
    const country = ctx.user?.countryName;

    if (!buildingType || !buildingName || !buildingImageFileId || !buildingDescription || !country) {
        return ctx.reply('❌ اطلاعات ناقص است.');
    }

    const imageUrl = await ctx.telegram.getFileLink(buildingImageFileId).then(link => link.href);
    const result = await changeCapital(userId, 'subtract', setupCost);
    if (result !== 'ok') return ctx.reply('❌ خطا در کسر سرمایه.');

    const profitPercent = buildingType === 'car' ? null : Math.floor(10 + Math.random() * 72);

    await prisma.pendingProductionLine.create({
        data: {
            ownerId: userId,
            name: buildingName,
            type: buildingType,
            imageUrl,
            imageFileId: buildingImageFileId,
            description: buildingDescription,
            dailyLimit: 15,
            setupCost: BigInt(setupCost),
            country,
            profitPercent
        }
    });

    const caption = escapeMarkdownV2(
        `📥 درخواست ساخت ${buildingType === 'car' ? 'خط تولید خودرو' : `پروژه ${buildingType}`}\n\n` +
        `> کشور: *${country}*\n` +
        `> نام: *${buildingName}*\n` +
        `> توضیح: ${buildingDescription}\n` +
        `> بودجه: ${Math.floor(setupCost / 1_000_000)}M` +
        (profitPercent !== null ? `\n> سوددهی: ${profitPercent}%` : '') +
        (buildingType === 'car' ? `\nظرفیت تولید روزانه: 15 خودرو` : '')
    );

    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('✅ تأیید ساخت', `admin_approve_building_${userId}`)],
        [Markup.button.callback('❌ رد درخواست', `admin_reject_building_${userId}`)]
    ]);

    for (const admin of admins) {
        await ctx.telegram.sendPhoto(admin, buildingImageFileId, {
            caption,
            parse_mode: 'MarkdownV2',
            reply_markup: keyboard.reply_markup
        });
    }

    await ctx.reply('📤 درخواست شما برای بررسی ادمین ارسال شد.');
    ctx.session.buildingStep = undefined;
});

// تأیید نهایی توسط ادمین
car.action(/admin_approve_building_(\d+)/, async (ctx) => {
    const userId = BigInt(ctx.match[1]);
    const user = await prisma.user.findUnique({ where: { userid: userId } });
    const pending = await prisma.pendingProductionLine.findFirst({ where: { ownerId: userId } });
    if (!user || !pending) return ctx.reply('❌ اطلاعات یافت نشد.');

    // محاسبه سود روزانه برای پروژه‌های عمرانی
    let addedProfit = 0;
    if (pending.type !== 'car' && pending.profitPercent) {
        const base = Number(pending.setupCost);
        addedProfit = Math.floor(base * pending.profitPercent / 100);

        await prisma.user.update({
            where: { userid: userId },
            data: {
                dailyProfit: { increment: addedProfit }
            }
        });
    }

    await prisma.productionLine.create({
        data: {
            ownerId: userId,
            name: pending.name,
            type: pending.type,
            imageUrl: pending.imageUrl,
            imageFileId: pending.imageFileId,
            dailyLimit: pending.dailyLimit,
            setupCost: pending.setupCost,
            country: pending.country,
            profitPercent: pending.profitPercent
        }
    });

    await prisma.pendingProductionLine.delete({ where: { id: pending.id } });

    await ctx.telegram.sendPhoto(config.channels.updates, pending.imageFileId, {
        caption: escapeMarkdownV2(
            `🏭 خط تولید جدید راه‌اندازی شد\n\n` +
            `> کشور سازنده: *${user.countryName}*\n` +
            `> محصول: *${pending.name}*\n\n` +
            `بودجه راه‌اندازی: ${pending.setupCost.toLocaleString()} ریال\n` +
            `ظرفیت تولید روزانه: ${pending.dailyLimit} واحد`
        ),
        parse_mode: 'MarkdownV2'
    });

    // پیام به کاربر درباره تأیید و سوددهی
    try {
        let message =
            `✅ پروژه "${pending.name}" تأیید شد و خط تولید فعال شد.\n` +
            `🏗 نوع پروژه: ${pending.type}\n` +
            `💰 بودجه: ${Math.floor(Number(pending.setupCost) / 1_000_000)}M`;

        if (addedProfit > 0) {
            message += `\n➕ سود روزانه: ${Math.floor(addedProfit / 1_000_000)}M به حساب سود شما اضافه شد.`;
        }

        await ctx.telegram.sendMessage(Number(userId), message);
    } catch (err) {
        console.warn('❌ ارسال پیام به کاربر ممکن نبود:', err);
    }

    await ctx.reply('✅ خط تولید ثبت شد و به کانال ارسال شد.');
});

// رد درخواست توسط ادمین
car.action(/admin_reject_building_(\d+)/, async (ctx) => {
    const userId = BigInt(ctx.match[1]);
    const adminId = ctx.from.id;

    if (!admins.includes(adminId)) {
        return ctx.answerCbQuery('⛔ فقط ادمین می‌تونه رد کنه.');
    }

    const pending = await prisma.pendingProductionLine.findFirst({ where: { ownerId: userId } });

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
    await prisma.pendingProductionLine.deleteMany({ where: { ownerId: userId } });

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

export default car;