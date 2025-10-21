import { Composer, Markup } from 'telegraf';
import type { CustomContext } from '../../middlewares/userAuth';
import { escapeMarkdownV2 } from '../../utils/escape';
import { prisma } from '../../prisma';
import config from '../../config/config.json';
import { changeCapital } from '../economy';

const admins: number[] = config.manage.buildings.construction.admins;
const construction = new Composer<CustomContext>();

type ProjectType = 'game' | 'film' | 'music';

const emojiMap: Record<ProjectType, string> = {
    game: '🎮',
    film: '🎬',
    music: '🎼'
};

// منوی انتخاب نوع پروژه عمرانی
construction.action('construction', async (ctx) => {
    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('🎮 بازی‌سازی', 'construct_game')],
        [Markup.button.callback('🎬 فیلم‌سازی', 'construct_film')],
        [Markup.button.callback('🎼 موزیک‌سازی', 'construct_music')],
        [Markup.button.callback('🔙 بازگشت', 'back_main')]
    ]);
    await ctx.reply('🏗 نوع پروژه عمرانی را انتخاب کن:', keyboard);
    ctx.answerCbQuery();
});

// شروع ساخت پروژه عمرانی
for (const type of ['game', 'film', 'music'] as ProjectType[]) {
    construction.action(`construct_${type}`, async (ctx) => {
        ctx.session = {
            buildingType: type,
            buildingStep: 'awaiting_setup_cost'
        };
        await ctx.reply('💰 سرمایه اولیه پروژه را وارد کن (بین 55 تا 750 میلیون):');
        ctx.answerCbQuery();
    });
}

// دریافت مراحل پروژه عمرانی
construction.on('text', async (ctx, next) => {
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
                `💰 مورد نیاز: ${(cost / 1_000_000).toLocaleString()}M\n` +
                `💳 موجودی فعلی: ${Number(user.capital / BigInt(1_000_000)).toLocaleString()}M`
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

    return next();
});

// دریافت تصویر و ارسال برای تأیید ادمین
construction.on('photo', async (ctx, next) => {
    ctx.session ??= {};
    if (ctx.session.buildingStep !== 'awaiting_image') return next();

    const photo = ctx.message.photo?.at(-1);
    if (!photo) return ctx.reply('❌ تصویر معتبر ارسال نشده.');

    const imageUrl = await ctx.telegram.getFileLink(photo.file_id);
    const { buildingType, buildingName, setupCost } = ctx.session;
    const userId = BigInt(ctx.from.id);
    const user = ctx.user;
    const country = user.countryName;

    const result = await changeCapital(userId, 'subtract', setupCost);
    if (result !== 'ok') return ctx.reply('❌ خطا در کسر سرمایه.');

    const profitPercent = Math.floor(10 + Math.random() * 72);

    await prisma.pendingProductionLine.create({
        data: {
            ownerId: userId,
            name: buildingName,
            type: buildingType,
            imageUrl: imageUrl.href,
            imageFileId: photo.file_id,
            description: '',
            dailyLimit: 0,
            setupCost: BigInt(setupCost),
            country,
            profitPercent
        }
    });

    const emoji = emojiMap[buildingType];
    const preview = escapeMarkdownV2(
        `${emoji} پروژه جدید ساخته شد\n\n` +
        `کشور سازنده: *${country}*\n` +
        `محصول: *${buildingName}*\n\n` +
        `بودجه راه‌اندازی: ${setupCost.toLocaleString()} ریال\n` +
        `سود روزانه: ${Math.floor(setupCost * profitPercent / 100).toLocaleString()}`
    );

    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('✅ ارسال برای تأیید ادمین', 'submit_construction')],
        [Markup.button.callback('🔙 بازگشت', 'construction')]
    ]);

    await ctx.replyWithPhoto(photo.file_id, {
        caption: preview,
        parse_mode: 'MarkdownV2',
        reply_markup: keyboard.reply_markup
    });

    ctx.session = {};
});

construction.action('submit_construction', async (ctx) => {
    const userId = BigInt(ctx.from.id);
    const pending = await prisma.pendingProductionLine.findFirst({ where: { ownerId: userId }, orderBy: { createdAt: 'desc' } });
    if (!pending) return ctx.reply('❌ پروژه در انتظار تأیید یافت نشد.');

    const emoji = emojiMap[pending.type as ProjectType];
    const caption = escapeMarkdownV2(
        `${emoji} پروژه جدید ساخته شد\n\n` +
        `کشور سازنده: *${pending.country}*\n` +
        `محصول: *${pending.name}*\n\n` +
        `بودجه راه‌اندازی: ${pending.setupCost.toLocaleString()} ریال\n` +
        `سود روزانه: ${Math.floor(Number(pending.setupCost) * (pending.profitPercent ?? 0) / 100).toLocaleString()}`
    );

    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('✅ تأیید ساخت', `admin_approve_construction_${userId}`)],
        [Markup.button.callback('❌ رد درخواست', `admin_reject_construction_${userId}`)]
    ]);

    for (const admin of admins) {
        await ctx.telegram.sendPhoto(admin, pending.imageFileId, {
            caption,
            parse_mode: 'MarkdownV2',
            reply_markup: keyboard.reply_markup
        });
    }

    await ctx.reply('📤 پروژه برای بررسی ادمین ارسال شد.');
    ctx.answerCbQuery();
});

// تأیید توسط ادمین
construction.action(/admin_approve_construction_(\d+)/, async (ctx) => {
    const userId = BigInt(ctx.match[1]);
    const pending = await prisma.pendingProductionLine.findFirst({ where: { ownerId: userId } });
    if (!pending) return ctx.reply('❌ پروژه یافت نشد.');

    const profitAmount = Math.floor(Number(pending.setupCost) * (pending.profitPercent ?? 0) / 100);

    await prisma.user.update({
        where: { userid: userId },
        data: {
            dailyProfit: { increment: profitAmount }
        }
    });

    await prisma.productionLine.create({
        data: {
            ownerId: userId,
            name: pending.name,
            type: pending.type,
            imageUrl: pending.imageUrl,
            imageFileId: pending.imageFileId,
            dailyLimit: 0,
            dailyOutput: 0,
            setupCost: pending.setupCost,
            country: pending.country
        }
    });

    await prisma.pendingProductionLine.delete({ where: { id: pending.id } });

    await ctx.telegram.sendMessage(Number(userId),
        `✅ پروژه "${pending.name}" تأیید شد و به لیست پروژه‌های فعال شما اضافه شد.\n` +
        `💰 بودجه: ${Math.floor(Number(pending.setupCost) / 1_000_000)}M\n` +
        `➕ سود روزانه: ${Math.floor(profitAmount / 1_000_000)}M به حساب سود شما افزوده شد.`
    );

    await ctx.reply('✅ پروژه تأیید و ثبت شد.');
});
construction.action(/admin_reject_construction_(\d+)/, async (ctx) => {
    const userId = BigInt(ctx.match[1]);
    const adminId = ctx.from.id;

    if (!admins.includes(adminId)) {
        return ctx.answerCbQuery('⛔ فقط ادمین می‌تونه رد کنه.');
    }

    const pending = await prisma.pendingProductionLine.findFirst({ where: { ownerId: userId } });
    if (!pending) return ctx.answerCbQuery('❌ پروژه یافت نشد.');

    const refund = Number(pending.setupCost);
    const result = await changeCapital(userId, 'add', refund);
    if (result !== 'ok') return ctx.answerCbQuery('❌ خطا در بازگرداندن سرمایه.');

    await prisma.pendingProductionLine.delete({ where: { id: pending.id } });

    try {
        await ctx.telegram.sendMessage(Number(userId),
            `❌ پروژه "${pending.name}" توسط ادمین رد شد.\n💸 مبلغ ${Math.floor(refund / 1_000_000)}M به حساب شما برگشت داده شد.`
        );
    } catch (err) {
        console.warn('❌ ارسال پیام به کاربر ممکن نبود:', err);
    }

    await ctx.answerCbQuery('✅ پروژه رد شد و سرمایه برگشت.');
});

export default construction;