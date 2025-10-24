import { Composer, Markup } from 'telegraf';
import type { CustomContext } from '../../middlewares/userAuth';
import { escapeMarkdownV2,md } from '../../utils/escape';
import { prisma } from '../../prisma';
import config from '../../config/config.json';
import { changeCapital } from '../economy';

const admins: number[] = config.manage.buildings.car.admins;
const car = new Composer<CustomContext>();

car.action('build_car', async (ctx) => {
    const userId = BigInt(ctx.from.id);
    const user = await prisma.user.findUnique({ where: { userid: userId } });
    if (!user) return ctx.reply('❌ کاربر یافت نشد.');

    const requiredCapital = 250_000_000;
    if (user.capital < BigInt(requiredCapital)) {
        return ctx.reply(
            `❌ سرمایه کافی برای ساخت خودرو ندارید.\n` +
            `💰 مورد نیاز: ${Math.floor(requiredCapital / 1_000_000)}M\n` +
            `💳 موجودی فعلی: ${Math.floor(Number(user.capital) / 1_000_000)}M`
        );
    }

    const today = new Date().toDateString();
    const last = user.lastCarBuildAt;
    const isSameDay = last && new Date(last).toDateString() === today;

    if (isSameDay) {
        return ctx.reply('⛔ امروز قبلاً یک خودرو ساخته‌اید. فردا دوباره تلاش کنید.');
    }

    ctx.session = {
        buildingType: 'car',
        setupCost: 250_000_000,
        buildingStep: 'awaiting_name_car'
    };
    await ctx.reply('📌 نام پروژه خودرو را وارد کن:');
    ctx.answerCbQuery();
});

// دریافت نام پروژه
car.on('text', async (ctx, next) => {
    ctx.session ??= {};

    if (ctx.session.buildingStep === 'awaiting_name_car') {
        const name = ctx.message.text?.trim();
        if (!name || name.length < 2) return ctx.reply('❌ نام محصول معتبر نیست.');

        ctx.session.buildingName = name;
        ctx.session.buildingStep = 'awaiting_image';
        await ctx.reply('🖼 حالا تصویر محصول را ارسال کن:');
        return;
    }

    if (ctx.session.buildingStep === 'awaiting_car_description') {
        const description = ctx.message.text?.trim();
        if (!description || description.length < 5) return ctx.reply('❌ توضیح خیلی کوتاهه.');

        ctx.session.buildingDescription = description;
        ctx.session.buildingStep = 'awaiting_admin_review';

        const preview =
            `🚗 پروژه ساخت خودرو\n\n` +
            `> کشور سازنده: _${md(ctx.user?.countryName)}_\n` +
            `> محصول: _${md(ctx.session.buildingName)}_\n` +
            `> توضیح: ${md(ctx.session.buildingDescription)}\n\n` +
            `💰 بودجه راه‌اندازی: ${Math.floor(ctx.session.setupCost / 1_000_000)}M\n` +
            `🔄 ظرفیت تولید روزانه: 15 خودرو\n\n` +
            `✅ اگر تأیید می‌کنی، دکمه زیر را بزن تا برای بررسی ادمین ارسال شود.`;

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
    ctx.session.buildingStep = 'awaiting_car_description';

    await ctx.reply('📝 توضیحی درباره محصولت بنویس (مثلاً ویژگی‌ها یا هدف تولید):');
});

// ارسال درخواست به ادمین
car.action('submit_building', async (ctx) => {
    ctx.session ??= {};
    const { buildingType, buildingName, buildingImageFileId, buildingDescription, setupCost } = ctx.session;
    const userId = BigInt(ctx.from.id);
    const country = ctx.user?.countryName;

    const user = await prisma.user.findUnique({ where: { userid: userId } });
    if (!user) return ctx.reply('❌ کاربر یافت نشد.');

    if (!buildingType || !buildingName || !buildingImageFileId || !buildingDescription || !country) {
        return ctx.reply('❌ اطلاعات ناقص است.');
    }

    const requiredCapital = 250_000_000;
    if (user.capital < BigInt(requiredCapital)) {
        return ctx.reply(
            `❌ سرمایه کافی برای ساخت خودرو ندارید.\n` +
            `💰 مورد نیاز: ${Math.floor(requiredCapital / 1_000_000)}M\n` +
            `💳 موجودی فعلی: ${Math.floor(Number(user.capital) / 1_000_000)}M`
        );
    }
    const imageUrl = await ctx.telegram.getFileLink(buildingImageFileId).then(link => link.href);
    const result = await changeCapital(userId, 'subtract', setupCost);
    if (result !== 'ok') return ctx.reply('❌ خطا در کسر سرمایه.');

    const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000); // 3 ساعت بعد

    const pending = await prisma.pendingProductionLine.create({
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
            expiresAt
        }
    });

    const caption =
        `📥 درخواست ساخت خط تولید خودرو\n\n` +
        `> کشور: _${md(country)}_\n` +
        `> نام: _${md(buildingName)}_\n` +
        `> توضیح: ${md(buildingDescription)}\n` +
        `> بودجه: ${Math.floor(setupCost / 1_000_000)}M\n` +
        `🔄 ظرفیت تولید روزانه: 15 خودرو`;

    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('✅ تأیید ساخت', `admin_approve_building_${pending.id}`)],
        [Markup.button.callback('❌ رد درخواست', `admin_reject_building_${pending.id}`)]
    ]);

    for (const admin of admins) {
        const sent = await ctx.telegram.sendPhoto(admin, buildingImageFileId, {
            caption,
            parse_mode: 'MarkdownV2',
            reply_markup: keyboard.reply_markup
        });

        await prisma.pendingProductionLine.update({
            where: { id: pending.id },
            data: {
                adminMessageId: sent.message_id,
                adminChatId: BigInt(admin)
            }
        });
    }

    await ctx.reply('📤 درخواست شما برای بررسی ادمین ارسال شد.');
    ctx.session = {};
});

// تأیید نهایی توسط ادمین
car.action(/^admin_approve_building_(\d+)$/, async (ctx) => {
    const adminId = ctx.from.id;
    if (!admins.includes(adminId)) {
        return ctx.answerCbQuery('⛔ فقط ادمین می‌تونه تأیید کنه.');
    }

    const pendingId = Number(ctx.match[1]);
    const pending = await prisma.pendingProductionLine.findUnique({ where: { id: pendingId } });
    if (!pending) return ctx.reply('❌ اطلاعات یافت نشد.');
    const now = new Date();
    if (pending.expiresAt && pending.expiresAt < now) {
        return ctx.reply('⛔ این پروژه منقضی شده و قابل تأیید نیست.');
    }

    const userId = pending.ownerId;
    const user = await prisma.user.findUnique({ where: { userid: userId } });
    if (!user) return ctx.reply('❌ کاربر یافت نشد.');

    await prisma.user.update({
        where: { userid: userId },
        data: {
            lastCarBuildAt: new Date()
        }
    });

    await prisma.productionLine.create({
        data: {
            ownerId: userId,
            name: pending.name,
            type: pending.type,
            imageUrl: pending.imageUrl,
            imageFileId: pending.imageFileId,
            dailyLimit: pending.dailyLimit,
            setupCost: pending.setupCost,
            country: pending.country
        }
    });

    await prisma.pendingProductionLine.delete({ where: { id: pendingId } });

    await ctx.telegram.sendPhoto(config.channels.updates, pending.imageFileId, {
        caption:
            `🏭 خط تولید جدید راه‌اندازی شد\n\n` +
            `> کشور سازنده: _${escapeMarkdownV2(user.countryName)}_\n` +
            `> محصول: _${escapeMarkdownV2(pending.name)}_\n\n` +
            `💰 بودجه راه‌اندازی: ${pending.setupCost.toLocaleString()}\n` +
            `🔄 ظرفیت تولید روزانه: ${pending.dailyLimit} واحد`,
        parse_mode: 'MarkdownV2'
    });

    await ctx.telegram.sendMessage(Number(userId),
        `✅ پروژه "${pending.name}" تأیید شد و خط تولید فعال شد.\n` +
        `🚗 نوع پروژه: خودرو\n` +
        `💰 بودجه: ${Math.floor(Number(pending.setupCost) / 1_000_000)}M\n` +
        `🔄 ظرفیت تولید روزانه: ${pending.dailyLimit} واحد`
    );

    // ویرایش پیام ادمین (در صورت وجود)
    if (pending.adminChatId && pending.adminMessageId) {
        try {
            await ctx.telegram.editMessageCaption(
                pending.adminChatId.toString(),
                pending.adminMessageId,
                undefined,
                '✅ این پروژه تأیید شد و در سیستم ثبت گردید.'
            );
        } catch (err) {
            console.warn('❌ خطا در ویرایش پیام ادمین:', err);
        }
    }

    await ctx.answerCbQuery('✅ پروژه تأیید شد.');
    await ctx.reply('✅ پروژه تأیید و ثبت شد.');
});
car.action(/^admin_reject_building_(\d+)$/, async (ctx) => {
    const adminId = ctx.from.id;
    if (!admins.includes(adminId)) {
        return ctx.answerCbQuery('⛔ فقط ادمین می‌تونه رد کنه.');
    }

    const pendingId = Number(ctx.match[1]);
    const pending = await prisma.pendingProductionLine.findUnique({ where: { id: pendingId } });
    if (!pending) return ctx.answerCbQuery('❌ پروژه یافت نشد.');
    const now = new Date();
    if (pending.expiresAt && pending.expiresAt < now) {
        return ctx.reply('⛔ این پروژه منقضی شده و قابل تأیید نیست.');
    }

    const refund = Number(pending.setupCost);
    const result = await changeCapital(pending.ownerId, 'add', refund);
    if (result !== 'ok') return ctx.answerCbQuery('❌ خطا در بازگرداندن سرمایه.');

    await prisma.pendingProductionLine.delete({ where: { id: pendingId } });

    try {
        await ctx.telegram.sendMessage(Number(pending.ownerId),
            `❌ پروژه "${pending.name}" توسط ادمین رد شد.\n💸 مبلغ ${Math.floor(refund / 1_000_000)}M به حساب شما برگشت داده شد.`
        );
    } catch (err) {
        console.warn('❌ ارسال پیام به کاربر ممکن نبود:', err);
    }

    if (pending.adminChatId && pending.adminMessageId) {
        await ctx.telegram.editMessageCaption(
            pending.adminChatId.toString(),
            pending.adminMessageId,
            undefined,
            '❌ این پروژه رد شد و بسته شد.'
        );
    }

    await ctx.answerCbQuery('✅ پروژه رد شد.');
});

export default car;