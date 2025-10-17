import { Composer, Markup } from 'telegraf';
import type { CustomContext } from '../middlewares/userAuth';
import { prisma } from '../prisma';
import { escapeMarkdownV2 } from '../utils/escape';
import { changeCapital } from './economy';

const building = new Composer<CustomContext>();
const BUILDING_TYPES = ['car', 'film', 'music', 'game'];

building.action('building', async (ctx) => {
    const keyboard = Markup.inlineKeyboard([
        ...BUILDING_TYPES.map(type => [Markup.button.callback(type === 'car' ? '🚗 خودرو' : `🎬 ${type}`, `build_${type}`)]),
        [Markup.button.callback('🔙 بازگشت', 'back_main')]
    ]);
    await ctx.reply('🏗 نوع ساخت‌وساز را انتخاب کن:', keyboard);
    ctx.answerCbQuery();
});

building.action(/^build_(\w+)$/, async (ctx) => {
    const type = ctx.match[1];
    if (!BUILDING_TYPES.includes(type)) return ctx.answerCbQuery('❌ نوع نامعتبر است.');
    ctx.session = { buildingType: type, buildingStep: 'awaiting_name' };
    await ctx.reply(`📌 نام ${type === 'car' ? 'محصول' : 'پروژه'} را وارد کن:`);
    ctx.answerCbQuery();
});

building.on('text', async (ctx, next) => {
    const step = ctx.session?.buildingStep;
    if (step === 'awaiting_name') {
        const name = ctx.message.text?.trim();
        if (!name || name.length < 2) return ctx.reply('❌ نام معتبر نیست.');
        ctx.session.buildingName = name;
        ctx.session.buildingStep = 'awaiting_image';
        return ctx.reply('🖼 حالا تصویر را ارسال کن:');
    } else if (step === 'awaiting_description') {
        const description = ctx.message.text?.trim();
        if (!description || description.length < 5) return ctx.reply('❌ توضیح خیلی کوتاهه.');
        ctx.session.buildingDescription = description;
        ctx.session.buildingStep = 'awaiting_admin_review';

        const preview = escapeMarkdownV2(
            `🏗 پیش‌نمایش ساخت ${ctx.session.buildingType}\n\n` +
            `> نام: *${ctx.session.buildingName}*\n` +
            `> توضیح: ${ctx.session.buildingDescription}\n\n` +
            `✅ اگر تأیید می‌کنی، دکمه زیر را بزن تا برای بررسی ادمین ارسال شود.`
        );

        const keyboard = Markup.inlineKeyboard([
            [Markup.button.callback('✅ ارسال برای تأیید', 'submit_building')],
            [Markup.button.callback('🔙 بازگشت', 'building')]
        ]);

        await ctx.replyWithPhoto(ctx.session.buildingImageFileId, {
            caption: preview,
            parse_mode: 'MarkdownV2',
            reply_markup: keyboard.reply_markup
        });
    } else {
        return next();
    }
});

building.on('photo', async (ctx, next) => {
    if (ctx.session?.buildingStep !== 'awaiting_image') return next();
    const photo = ctx.message.photo?.at(-1);
    if (!photo) return ctx.reply('❌ تصویر معتبر نیست.');
    ctx.session.buildingImageFileId = photo.file_id;
    ctx.session.buildingStep = 'awaiting_description';
    await ctx.reply('📝 توضیحی درباره پروژه بنویس:');
});

building.action('submit_building', async (ctx) => {
    const { buildingType, buildingName, buildingImageFileId, buildingDescription } = ctx.session;
    const userId = BigInt(ctx.from.id);
    const country = ctx.user?.countryName;
    if (!buildingType || !buildingName || !buildingImageFileId || !buildingDescription || !country) {
        return ctx.reply('❌ اطلاعات ناقص است.');
    }

    const setupCost = buildingType === 'car'
        ? 250_000_000
        : Math.floor(55_000_000 + Math.random() * 695_000_000);
    const profitPercent = buildingType === 'car' ? null : Math.floor(10 + Math.random() * 72);

    const result = await changeCapital(userId, 'subtract', setupCost);
    if (result !== 'ok') return ctx.reply('❌ خطا در کسر سرمایه.');

    await prisma.pendingProductionLine.create({
        data: {
            ownerId: userId,
            name: buildingName,
            type: buildingType,
            imageFileId: buildingImageFileId,
            imageUrl: await ctx.telegram.getFileLink(buildingImageFileId).then(link => link.href),
            description: buildingDescription,
            setupCost: BigInt(setupCost),
            dailyLimit: 15,
            country,
            profitPercent
        }
    });

    await ctx.reply('📤 درخواست شما برای بررسی ادمین ارسال شد.');
    ctx.session.buildingStep = undefined;
});

export default building;
