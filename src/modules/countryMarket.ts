import { Composer, Markup } from 'telegraf';
import type { CustomContext } from '../middlewares/userAuth';
import { prisma } from '../prisma';
import { changeCapital } from './economy';
import { escapeMarkdownV2 } from '../utils/escape';

const sell = new Composer<CustomContext>();

// دستور /sell برای نمایش تولیدات قابل فروش
sell.action('sell', async (ctx) => {
    const userId = BigInt(ctx.from.id);
    const productions = await prisma.productionLine.findMany({ where: { ownerId: userId } });

    if (productions.length === 0) {
        await ctx.reply('❌ شما هیچ تولید فعالی برای فروش ندارید.');
        return ctx.answerCbQuery();
    }

    for (const prod of productions) {
        const price = prod.type === 'car'
            ? (prod.unitPrice ?? 0) * prod.dailyLimit
            : Number(prod.setupCost) + Math.floor(Number(prod.setupCost) * (prod.profitPercent ?? 0) / 100);

        const caption = escapeMarkdownV2(
            `🛒 ${prod.name} (${prod.type})\n` +
            `💰 قیمت فروش: ${Math.floor(price / 1_000_000)}M`
        );

        const keyboard = Markup.inlineKeyboard([
            [Markup.button.callback(`📤 فروش به ${Math.floor(price / 1_000_000)}M`, `sell_${prod.id}`)]
        ]);

        await ctx.replyWithPhoto(prod.imageUrl, {
            caption,
            parse_mode: 'MarkdownV2',
            reply_markup: keyboard.reply_markup
        });
    }

    ctx.answerCbQuery();
});

// هندل فروش با دکمه
sell.action(/^sell_(\d+)$/, async (ctx) => {
    const prodId = Number(ctx.match[1]);
    const userId = BigInt(ctx.from.id);

    const prod = await prisma.productionLine.findUnique({ where: { id: prodId } });
    if (!prod || prod.ownerId !== userId) {
        return ctx.answerCbQuery('❌ محصول یافت نشد یا متعلق به شما نیست.');
    }

    const price = prod.type === 'car'
        ? (prod.unitPrice ?? 0) * prod.dailyLimit
        : Number(prod.setupCost) + Math.floor(Number(prod.setupCost) * (prod.profitPercent ?? 0) / 100);

    const result = await changeCapital(userId, 'add', price);
    if (result !== 'ok') {
        return ctx.answerCbQuery('❌ خطا در انتقال سرمایه.');
    }

    await prisma.productionLine.delete({ where: { id: prodId } });

    await ctx.reply(`✅ "${prod.name}" با موفقیت فروخته شد.\n💰 مبلغ ${Math.floor(price / 1_000_000)}M به حساب شما اضافه شد.`);
    ctx.answerCbQuery();
});

export default sell;
