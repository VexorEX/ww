import { Composer, Markup } from 'telegraf';
import type { CustomContext } from '../middlewares/userAuth';
import { prisma } from '../prisma';
import { changeCapital } from './economy';
import { escapeMarkdownV2 } from '../utils/escape';

const products = new Composer<CustomContext>();

// تابع محاسبه قیمت فروش
function calculateSellPrice(prod: {
    type: string;
    unitPrice?: number | null;
    dailyLimit: number;
    setupCost: bigint;
    profitPercent?: number | null;
}): number {
    if (prod.type === 'car') {
        return (prod.unitPrice ?? 0) * prod.dailyLimit;
    }
    const base = Number(prod.setupCost);
    const profit = Math.floor(base * (prod.profitPercent ?? 0) / 100);
    return base + profit;
}

// نمایش تولیدات قابل فروش
products.action('products', async (ctx) => {
    const userId = BigInt(ctx.from.id);
    const lines = await prisma.productionLine.findMany({ where: { ownerId: userId } });

    if (lines.length === 0) {
        const keyboard = Markup.inlineKeyboard([
            [Markup.button.callback('🔙 بازگشت', 'back_main')]
        ]);
        await ctx.reply('❌ شما هیچ خط تولید فعالی ندارید.', keyboard);
        return ctx.answerCbQuery();
    }

    const rows = lines.map((line) => {
        const price = line.type === 'car'
            ? (line.unitPrice ?? 0)
            : Math.floor(Number(line.setupCost) * (line.profitPercent ?? 0) / 100);

        return [
            Markup.button.callback(`🏭 ${line.name}`, 'noop'),
            Markup.button.callback(`💰 ${Math.floor(price / 1_000_000)}M`, 'noop'),
            Markup.button.callback(`🔄 ${line.dailyLimit}`, 'noop'),
            Markup.button.callback('👁 نمایش', `show_${line.id}`)
        ];
    });

    rows.push([Markup.button.callback('🔙 بازگشت', 'back_main')]);

    await ctx.reply('📦 لیست خطوط تولید فعال شما:', {
        reply_markup: Markup.inlineKeyboard(rows).reply_markup
    });

    ctx.answerCbQuery();
});

// هندل فروش با دکمه
products.action(/^show_(\d+)$/, async (ctx) => {
    const lineId = Number(ctx.match[1]);
    const userId = BigInt(ctx.from.id);
    const line = await prisma.productionLine.findUnique({ where: { id: lineId } });
    if (!line || line.ownerId !== userId) return ctx.answerCbQuery('❌ خط تولید یافت نشد.');

    const unitPrice = line.type === 'car'
        ? (line.unitPrice ?? 0)
        : Math.floor(Number(line.setupCost) * (line.profitPercent ?? 0) / 100);

    const totalPrice = unitPrice * line.dailyLimit;

    const caption = escapeMarkdownV2(
        `📦 ${line.name} (${line.type})\n\n` +
        `💰 قیمت واحد: ${Math.floor(unitPrice / 1_000_000)}M\n` +
        `💰 قیمت کل: ${Math.floor(totalPrice / 1_000_000)}M\n\n` +
        `🔢 تعداد واحد: ${line.dailyLimit}\n` +
        `💳 مجموع: ${Math.floor(totalPrice / 1_000_000)}M`
    );

    const keyboard = Markup.inlineKeyboard([
        [
            Markup.button.callback(`💰 واحد: ${Math.floor(unitPrice / 1_000_000)}M`, 'noop'),
            Markup.button.callback(`💰 کل: ${Math.floor(totalPrice / 1_000_000)}M`, 'noop')
        ],
        [
            Markup.button.callback(`🔢 واحد: ${line.dailyLimit}`, 'noop'),
            Markup.button.callback(`💳 مجموع: ${Math.floor(totalPrice / 1_000_000)}M`, 'noop')
        ],
        [
            Markup.button.callback('🧾 فروش محصول', 'noop')
        ],
        [
            Markup.button.callback('📤 فروش واحد', `sell_one_${line.id}`),
            Markup.button.callback('📤 فروش همه', `sell_all_${line.id}`)
        ],
        [
            Markup.button.callback('❌ بستن', 'delete'),
            Markup.button.callback('🔙 بازگشت', 'products')
        ]
    ]);

    await ctx.reply(caption, {
        parse_mode: 'MarkdownV2',
        reply_markup: keyboard.reply_markup
    });

    ctx.answerCbQuery();
});

products.action(/^sell_one_(\d+)$/, async (ctx) => {
    const lineId = Number(ctx.match[1]);
    const userId = BigInt(ctx.from.id);
    const line = await prisma.productionLine.findUnique({ where: { id: lineId } });
    if (!line || line.ownerId !== userId) return ctx.answerCbQuery('❌ خط تولید یافت نشد.');

    ctx.session ??= {};
    ctx.session.sellLineId = lineId;
    ctx.session.sellStep = 'awaiting_sell_count';

    await ctx.reply(`📦 "${line.name}"\n🔢 چند واحد می‌خوای بفروشی؟ (حداکثر ${line.dailyLimit})`);
    ctx.answerCbQuery();
});
products.on('text', async (ctx, next) => {
    ctx.session ??= {};

    if (ctx.session.sellStep === 'awaiting_sell_count') {
        const raw = ctx.message.text?.trim();
        const count = Number(raw.replace(/[^\d]/g, ''));
        if (isNaN(count) || count <= 0) return ctx.reply('❌ عدد معتبر نیست.');

        const lineId = ctx.session.sellLineId;
        const userId = BigInt(ctx.from.id);
        const line = await prisma.productionLine.findUnique({ where: { id: lineId } });
        if (!line || line.ownerId !== userId) return ctx.reply('❌ خط تولید یافت نشد.');

        if (count > line.dailyLimit) {
            return ctx.reply(`❌ تعداد بیشتر از ظرفیت روزانه است.\n🔄 ظرفیت: ${line.dailyLimit}`);
        }

        const unitPrice = line.type === 'car'
            ? (line.unitPrice ?? 0)
            : Math.floor(Number(line.setupCost) * (line.profitPercent ?? 0) / 100);

        const total = unitPrice * count;
        const result = await changeCapital(userId, 'add', total);
        if (result !== 'ok') return ctx.reply('❌ خطا در انتقال سرمایه.');

        await prisma.productionLine.update({
            where: { id: lineId },
            data: { dailyLimit: { decrement: count } }
        });

        ctx.session.sellStep = undefined;
        ctx.session.sellLineId = undefined;

        await ctx.reply(`✅ ${count} واحد از "${line.name}" فروخته شد.\n💰 ${Math.floor(total / 1_000_000)}M به حساب شما اضافه شد.`);
        return;
    }

    return next();
});

products.action(/^sell_all_(\d+)$/, async (ctx) => {
    const lineId = Number(ctx.match[1]);
    const userId = BigInt(ctx.from.id);
    const line = await prisma.productionLine.findUnique({ where: { id: lineId } });
    if (!line || line.ownerId !== userId) return ctx.answerCbQuery('❌ خط تولید یافت نشد.');

    const unitPrice = line.type === 'car'
        ? (line.unitPrice ?? 0)
        : Math.floor(Number(line.setupCost) * (line.profitPercent ?? 0) / 100);

    const total = unitPrice * line.dailyLimit;

    const result = await changeCapital(userId, 'add', total);
    if (result !== 'ok') return ctx.answerCbQuery('❌ خطا در انتقال سرمایه.');

    await prisma.productionLine.delete({ where: { id: lineId } });

    await ctx.reply(`✅ همه واحدهای "${line.name}" فروخته شد.\n💰 ${Math.floor(total / 1_000_000)}M به حساب شما اضافه شد.`);
    ctx.answerCbQuery();
});



export default products;
