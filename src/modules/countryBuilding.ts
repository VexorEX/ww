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
        [Markup.button.callback('🎬 فیلم‌سازی', 'build_film')],
        [Markup.button.callback('🎵 موزیک‌سازی', 'build_music')],
        [Markup.button.callback('🎮 بازی‌سازی', 'build_game')],
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
    const pending = await prisma.pendingProductionLine.findFirst({ where: { ownerId: userId } });

    if (pending) {
        const oneHourAgo = Date.now() - 60 * 60 * 1000;
        const requestTime = ctx.session.buildingRequestTime ?? 0;

        if (requestTime < oneHourAgo) {
            // برگرداندن سرمایه
            const refund = await changeCapital(userId, 'add', Number(pending.setupCost));
            if (refund === 'not_found') {
                await ctx.reply('❌ کاربر یافت نشد برای بازگشت سرمایه.');
            } else if (refund === 'invalid' || refund === 'error') {
                await ctx.reply('❌ خطا در بازگشت سرمایه.');
            } else {
                await ctx.reply(`⌛ درخواست قبلی منقضی شد و مبلغ ${Number(pending.setupCost / BigInt(1_000_000)).toLocaleString()}M به حساب شما برگشت.`);
            }

            await prisma.pendingProductionLine.deleteMany({ where: { ownerId: userId } });
            ctx.session.buildingUsedToday = false;
            ctx.session.lastBuildDate = undefined;
            ctx.session.buildingRequestTime = undefined;
            return;
        } else {
            return ctx.reply('⛔ هنوز درخواست قبلی در حال بررسیه. لطفاً صبر کن یا بعداً دوباره تلاش کن.');
        }
    }


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
    if (['awaiting_car_name', 'awaiting_name'].includes(ctx.session.buildingStep)) {
        const name = ctx.message.text?.trim();
        if (!name || name.length < 2) {
            return ctx.reply('❌ نام محصول معتبر نیست. لطفاً دوباره وارد کن.');
        }

        if (ctx.session.buildingType === 'car') {
            ctx.session.carName = name;
        } else {
            ctx.session.buildingName = name;
        }

        ctx.session.buildingStep = 'awaiting_car_image';
        await ctx.reply('🖼 حالا تصویر محصول را ارسال کن:');
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

    await ctx.reply('📝 توضیحی درباره محصولت بنویس (مثلاً ویژگی‌ها یا هدف تولید):');

    ctx.session.carImageFileId = photo.file_id;

    ctx.session.buildingStep = 'awaiting_build_description';
});
building.on('text', async (ctx, next) => {
    ctx.session ??= {};
    if (ctx.session.buildingStep === 'awaiting_build_description') {
        const description = ctx.message.text;
        if (!description || description.length < 5) {
            return ctx.reply('❌ توضیح خیلی کوتاهه. لطفاً بیشتر توضیح بده.');
        }

        ctx.session.buildingDescription = description;
        ctx.session.buildingStep = 'awaiting_admin_review';

        const preview = escapeMarkdownV2(
            `🏭 پیش‌نمایش خط تولید خودرو\n\n` +
            `> کشور سازنده: **${ctx.user?.countryName}**\n` +
            `> محصول: **${ctx.session.carName}**\n` +
            `> توضیح: ${ctx.session.buildingDescription}\n\n` +
            `بودجه راه‌اندازی: 250M\nظرفیت تولید روزانه: 15 خودرو\n\n` +
            `✅ اگر تأیید می‌کنی، دکمه زیر را بزن تا برای بررسی ادمین ارسال شود.`
        );

        const confirmKeyboard = Markup.inlineKeyboard([
            [Markup.button.callback('✅ ارسال برای تأیید ادمین', 'submit_building')],
            [Markup.button.callback('🔙 بازگشت', 'building')]
        ]);

        await ctx.replyWithPhoto(ctx.session.carImageFileId, {
            caption: preview,
            parse_mode: 'MarkdownV2',
            reply_markup: confirmKeyboard.reply_markup
        });
    } else {
        return next();
    }
});

// ارسال درخواست به ادمین
building.action('submit_building', async (ctx) => {
    ctx.session ??= {};
    ctx.session.buildingUsedToday = true;
    ctx.session.lastBuildDate = new Date().toDateString();
    ctx.session.buildingRequestTime = Date.now();

    const userId = BigInt(ctx.from.id);
    const country = ctx.user?.countryName;
    const {
        buildingType,
        buildingImageFileId,
        buildingDescription
    } = ctx.session;
    const buildingName = ctx.session.buildingType === 'car'
        ? ctx.session.carName
        : ctx.session.buildingName;

    if (!buildingType || !buildingName || !buildingImageFileId || !buildingDescription || !country) {
        return ctx.reply('❌ اطلاعات ناقص است.');
    }

    const imageUrl = await ctx.telegram.getFileLink(buildingImageFileId).then(link => link.href);

    let setupCost: number;
    let profitPercent: number | null = null;

    if (buildingType === 'car') {
        setupCost = 250_000_000;
    } else {
        setupCost = Math.floor(55_000_000 + Math.random() * 695_000_000);
        profitPercent = Math.floor(10 + Math.random() * 72);
    }

    const result = await changeCapital(userId, 'subtract', setupCost);
    if (result !== 'ok') return ctx.reply('❌ خطا در کسر سرمایه.');

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
        `> کشور: **${country}**\n` +
        `> نام: **${buildingName}**\n` +
        `> توضیح: ${buildingDescription}\n` +
        `> بودجه: ${Math.floor(setupCost / 1_000_000)}M` +
        (profitPercent !== null ? `\n> سوددهی: ${profitPercent}%` : '') +
        (buildingType === 'car' ? `\nظرفیت تولید روزانه: 15 خودرو` : '')
    );

    const adminKeyboard = Markup.inlineKeyboard([
        [Markup.button.callback('✅ تأیید ساخت', `admin_approve_building_${userId}`)],
        [Markup.button.callback('❌ رد درخواست', `admin_reject_building_${userId}`)]
    ]);

    for (const admin of admins) {
        await ctx.telegram.sendPhoto(admin, buildingImageFileId, {
            caption,
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

    const pending = await prisma.pendingProductionLine.findFirst({ where: { ownerId: userId } });
    if (!pending) return ctx.reply('❌ اطلاعات محصول یافت نشد.');

    if (['film', 'music', 'game'].includes(pending.type)) {
        await prisma.productionLine.create({
            data: {
                ownerId: userId,
                name: pending.name,
                type: pending.type,
                imageUrl: pending.imageUrl,
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
                `> کشور سازنده: **${user.countryName}**\n` +
                `> محصول: **${pending.name}**\n\n` +
                `بودجه راه‌اندازی: ${pending.setupCost.toLocaleString()} ریال\n` +
                `ظرفیت تولید روزانه: ${pending.dailyLimit} واحد`
            ),
            parse_mode: 'MarkdownV2'
        });


        await ctx.reply('✅ پروژه تأیید شد و به کانال ارسال شد.');
    }

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

    await prisma.pendingProductionLine.deleteMany({ where: { ownerId: userId } });

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

for (const type of ['film', 'music', 'game']) {
    building.action(`build_${type}`, async (ctx) => {
        ctx.session = {
            buildingType: type,
            buildingStep: 'awaiting_name'
        };
        await ctx.reply(`📌 نام پروژه ${type === 'film' ? 'فیلم' : type === 'music' ? 'موزیک' : 'بازی'} را وارد کن:`);
        ctx.answerCbQuery();
    });
}



export default building;
