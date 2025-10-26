import {Composer, Markup} from "telegraf";
import type {CustomContext} from "../../middlewares/userAuth";
import config from '../../config/config.json'
import { changeUserField } from "../economy";
import { prisma } from "../../prisma";

const lottery = new Composer<CustomContext>();

lottery.action('admin_lottery', async (ctx) => {
    const adminId = ctx.from.id;
    if (!config.manage.lottery.admins.includes(adminId)) {
        return ctx.answerCbQuery('⛔ فقط ادمین‌ها می‌تونن لاتاری رو شروع کنن.');
    }

    if (ctx.session.lotteryActive) {
        return ctx.reply('⚠️ لاتاری فعال هست. ابتدا باید لاتاری قبلی رو ببندی.');
    }

    ctx.session.lotteryStep = 'awaiting_ticket_price';
    await ctx.reply('🎫 لطفاً قیمت هر بلیط را وارد کنید.\nمثال: `25000` یا `25(iron)`');
});
lottery.on('text', async (ctx, next) => {
    if (ctx.session?.lotteryStep !== 'awaiting_ticket_price') return next();

    const input = ctx.message.text.trim();
    const match = input.match(/^(\d+)(?:\((\w+)\))?$/);

    if (!match) return ctx.reply('❌ فرمت قیمت معتبر نیست. مثال: `25000` یا `25(iron)`');

    const amount = Number(match[1]);
    const unit = match[2] ?? 'capital';

    if (!config.manage.lottery.utils[unit]) {
        return ctx.reply('❌ واحد وارد شده معتبر نیست.');
    }

    ctx.session.lotteryActive = true;
    ctx.session.ticketPrice = amount;
    ctx.session.ticketUnit = unit;
    ctx.session.lotteryStep = undefined;

    await ctx.telegram.sendMessage(config.channels.lottery,
        `🎉 لاتاری جدید آغاز شد!\n` +
        `💸 قیمت هر بلیط: ${amount} ${config.manage.lottery.utils[unit]}\n` +
        `🎟️ برای خرید بلیط از دکمه زیر استفاده کنید.`,
        {
            reply_markup: Markup.inlineKeyboard([
                [Markup.button.callback('🎟️ خرید بلیط', 'buy_ticket')]
            ]).reply_markup
        }
    );

    await ctx.reply('✅ لاتاری با موفقیت شروع شد.');
});

lottery.action('buy_ticket', async (ctx) => {
    if (!ctx.session?.lotteryActive) {
        return ctx.answerCbQuery('⛔ لاتاری فعالی وجود ندارد.');
    }

    ctx.session.lotteryStep = 'awaiting_ticket_count';
    await ctx.reply('🎟️ چند بلیط می‌خوای بخری؟');
});
lottery.on('text', async (ctx, next) => {
    if (ctx.session?.lotteryStep !== 'awaiting_ticket_count') return next();

    const count = Number(ctx.message.text.trim());
    if (!count || count <= 0) return ctx.reply('❌ تعداد معتبر نیست.');

    const { ticketPrice, ticketUnit } = ctx.session;
    const totalCost = count * ticketPrice;
    const user = ctx.user;
    const currentBalance = user[ticketUnit as keyof typeof user] as number;

    if (currentBalance < totalCost) {
        return ctx.reply(`❌ موجودی کافی ندارید.\n💰 مورد نیاز: ${totalCost} ${config.manage.lottery.utils[ticketUnit]}`);
    }

    ctx.session.pendingTicketCount = count;
    ctx.session.lotteryStep = 'confirm_ticket_purchase';

    await ctx.reply(
        `✅ می‌خوای ${count} بلیط بخری به قیمت ${totalCost} ${config.manage.lottery.utils[ticketUnit]}؟`,
        {
            reply_markup: Markup.inlineKeyboard([
                [Markup.button.callback('✅ تأیید خرید', 'confirm_ticket')],
                [Markup.button.callback('❌ انصراف', 'cancel_ticket')]
            ]).reply_markup
        }
    );
});
lottery.action('confirm_ticket', async (ctx) => {
    const count = ctx.session.pendingTicketCount;
    const { ticketPrice, ticketUnit } = ctx.session;
    const totalCost = count * ticketPrice;

    const result = await changeUserField(ctx.user.userid, ticketUnit, 'subtract', totalCost);
    const ticketResult = await changeUserField(ctx.user.userid, 'lottery', 'add', count);

    if (result !== 'ok' || ticketResult !== 'ok') {
        return ctx.reply('❌ خطا در خرید بلیط.');
    }

    await ctx.telegram.sendMessage(config.channels.lottery,
        `🎟️ خرید بلیط لاتاری! 🎟️\n` +
        `> کشور ${ctx.user.countryName} با خرید ${count} بلیط جدید، شانس خود را در لاتاری بزرگ جهانی افزایش داد!`
    );

    ctx.session.pendingTicketCount = undefined;
    ctx.session.lotteryStep = undefined;
    await ctx.reply('✅ خرید بلیط با موفقیت انجام شد.');
});
lottery.action('cancel_ticket', async (ctx) => {
    ctx.session.pendingTicketCount = undefined;
    ctx.session.lotteryStep = undefined;
    await ctx.reply('❌ خرید بلیط لغو شد.');
});

lottery.action('end_lottery', async (ctx) => {
    const adminId = ctx.from.id;
    if (!config.manage.lottery.admins.includes(adminId)) {
        return ctx.answerCbQuery('⛔ فقط ادمین می‌تونه لاتاری رو ببنده.');
    }

    if (!ctx.session?.lotteryActive) {
        return ctx.reply('⚠️ لاتاری فعالی وجود ندارد.');
    }

    const users = await prisma.user.findMany({ select: { userid: true, countryName: true, lottery: true } });
    const pool: { userid: bigint; country: string }[] = [];

    for (const user of users) {
        for (let i = 0; i < user.lottery; i++) {
            pool.push({ userid: user.userid, country: user.countryName });
        }
    }

    if (pool.length === 0) return ctx.reply('❌ هیچ بلیطی فروخته نشده.');

    const winner = pool[Math.floor(Math.random() * pool.length)];
    const winnerTickets = users.find(u => u.userid === winner.userid)?.lottery || 0;
    const prize = pool.length * ctx.session.ticketPrice * 1000;

    await ctx.telegram.sendMessage(config.channels.lottery,
        `🎊 برنده لاتاری بزرگ جهانی مشخص شد! 🎊\n` +
        `پس از فروش ${pool.length} بلیط، قرعه‌کشی انجام شد و برنده خوش‌شانس این دوره مشخص گردید!\n` +
        `> 🏆 برنده: کشور ${winner.country} 🎟️ تعداد بلیط‌های برنده: ${winnerTickets}\n` +
        `💰 مبلغ جایزه: ${prize.toLocaleString()} دلار\n` +
        `.تبریک به برنده بزرگ این دوره! منتظر دور بعدی لاتاری باشید`
    );

    await prisma.user.updateMany({ data: { lottery: 0 } });
    ctx.session.lotteryActive = false;
    ctx.session.ticketPrice = undefined;
    ctx.session.ticketUnit = undefined;

    await ctx.reply('✅ لاتاری با موفقیت پایان یافت.');
});

export default lottery;