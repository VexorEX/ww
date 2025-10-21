import { Composer, Markup } from 'telegraf';
import type { CustomContext } from '../middlewares/userAuth';
import { prisma } from '../prisma';
import { changeCapital } from './economy';
import { escapeMarkdownV2 } from '../utils/escape';

const products = new Composer<CustomContext>();

// محاسبه قیمت فروش پروژه‌های عمرانی
function calculateSellPrice(prod: {
    type: string;
    unitPrice?: number | null;
    dailyOutput: number;
    setupCost: bigint;
    profitPercent?: number | null;
}): number {
    if (prod.type === 'car') {
        return (prod.unitPrice ?? 0) * prod.dailyOutput;
    }
    const base = Number(prod.setupCost);
    const profit = Math.floor(base * (prod.profitPercent ?? 0) / 100);
    return base + profit;
}

// نمایش لیست خطوط تولید
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

// نمایش پنل جزئیات هر خط تولید
products.action(/^show_(\d+)$/, async (ctx) => {
    const lineId = Number(ctx.match[1]);
    const userId = BigInt(ctx.from.id);
    const line = await prisma.productionLine.findUnique({ where: { id: lineId } });
    if (!line || line.ownerId !== userId) return ctx.answerCbQuery('❌ خط تولید یافت نشد.');

    const unitPrice = line.type === 'car'
        ? (line.unitPrice ?? 0)
        : Math.floor(Number(line.setupCost) * (line.profitPercent ?? 0) / 100);

    const totalPrice = unitPrice * line.dailyOutput;

    const caption = escapeMarkdownV2(
        `📦 ${line.name} (${line.type})\n\n` +
        `💰 قیمت واحد: ${Math.floor(unitPrice / 1_000_000)}M\n` +
        `💰 قیمت کل: ${Math.floor(totalPrice / 1_000_000)}M\n\n` +
        `🔄 عمر باقی‌مانده: ${line.dailyLimit} روز\n` +
        `🚗 خروجی امروز: ${line.dailyOutput} واحد`
    );

    const keyboard = Markup.inlineKeyboard([
        [
            Markup.button.callback(`🔄 عمر: ${line.dailyLimit} روز`, 'noop'),
            Markup.button.callback(`🚗 خروجی: ${line.dailyOutput}`, 'noop')
        ],
        [
            Markup.button.callback(`💵 ارزش واحد: ${Math.floor(unitPrice / 1_000_000)}M`, 'noop'),
            Markup.button.callback(`💵 ارزش کل: ${Math.floor(totalPrice / 1_000_000)}M`, 'noop')
        ],
        [
            Markup.button.callback('🧾 فروش محصول', 'noop')
        ],
        line.type === 'car'
            ? [Markup.button.callback('📤 فروش همه خودروها', `sell_all_${line.id}`)]
            : [Markup.button.callback('📤 فروش تعداد', `sell_one_${line.id}`)],
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

// فروش پروژه‌های عمرانی به تعداد دلخواه
products.action(/^sell_one_(\d+)$/, async (ctx) => {
    const lineId = Number(ctx.match[1]);
    const userId = BigInt(ctx.from.id);
    const line = await prisma.productionLine.findUnique({ where: { id: lineId } });
    if (!line || line.ownerId !== userId || line.type === 'car') return ctx.answerCbQuery('❌ خط تولید عمرانی یافت نشد.');

    ctx.session ??= {};
    ctx.session.sellLineId = lineId;
    ctx.session.sellStep = 'awaiting_sell_count';

    await ctx.reply(`📦 "${line.name}"\n🔢 چند واحد می‌خوای بفروشی؟ (حداکثر ${line.dailyLimit})`);
    ctx.answerCbQuery();
});

// دریافت تعداد فروش از کاربر
products.on('text', async (ctx, next) => {
    ctx.session ??= {};

    if (ctx.session.sellStep === 'awaiting_sell_count') {
        const raw = ctx.message.text?.trim();
        const count = Number(raw.replace(/[^\d]/g, ''));
        if (isNaN(count) || count <= 0) return ctx.reply('❌ عدد معتبر نیست.');

        const lineId = ctx.session.sellLineId;
        const userId = BigInt(ctx.from.id);
        const line = await prisma.productionLine.findUnique({ where: { id: lineId } });
        if (!line || line.ownerId !== userId || line.type === 'car') return ctx.reply('❌ خط تولید عمرانی یافت نشد.');

        if (count > line.dailyLimit) {
            return ctx.reply(`❌ تعداد بیشتر از ظرفیت روزانه است.\n🔄 ظرفیت: ${line.dailyLimit}`);
        }

        const unitPrice = Math.floor(Number(line.setupCost) * (line.profitPercent ?? 0) / 100);
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

// فروش همه خودروهای تولیدشده از جدول Car
products.action(/^sell_all_(\d+)$/, async (ctx) => {
    const lineId = Number(ctx.match[1]);
    const userId = BigInt(ctx.from.id);

    const line = await prisma.productionLine.findUnique({ where: { id: lineId } });
    if (!line || line.ownerId !== userId || line.type !== 'car') {
        return ctx.answerCbQuery('❌ خط تولید خودرو یافت نشد.');
    }

    const cars = await prisma.car.findMany({
        where: {
            ownerId: userId,
            lineId: lineId,
            name: line.name,
            imageUrl: line.imageUrl
        }
    });

    if (cars.length === 0) {
        return ctx.answerCbQuery('❌ هیچ خودرویی برای فروش موجود نیست.');
    }

    const total = cars.reduce((sum, car) => sum + car.price, 0);

    const result = await changeCapital(userId, 'add', total);
    if (result !== 'ok') return ctx.answerCbQuery('❌ خطا در انتقال سرمایه.');

    await prisma.car.deleteMany({
        where: {
            ownerId: userId,
            name: line.name,
            imageUrl: line.imageUrl,
            lineId: lineId
        }
    });

    await ctx.reply(
        `✅ ${cars.length} خودرو از "${line.name}" فروخته شد.\n` +
        `💰 مجموع دریافتی: ${Math.floor(total / 1_000_000)}M`
    );

    ctx.answerCbQuery();
});

export default products;
