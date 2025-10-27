import {Composer, Markup} from "telegraf";
import type {CustomContext} from "../../middlewares/userAuth";
import config from '../../config/config.json'
import { changeUserField } from "../economy";
import { prisma } from "../../prisma";

const lottery = new Composer<CustomContext>();

// Debug command for lottery tickets
lottery.command('cticket', async (ctx) => {
    const adminId = ctx.from.id;
    if (!config.manage.lottery.admins.includes(adminId)) {
        return ctx.reply('⛔ فقط ادمین‌ها می‌تونن از این دستور استفاده کنن.');
    }

    const args = ctx.message.text.split(' ').slice(1);
    const price = parseInt(args[0]);

    if (!price || price <= 0) {
        return ctx.reply('❌ فرمت صحیح: /cticket <قیمت>');
    }

    if (ctx.session.lotteryActive) {
        return ctx.reply('⚠️ لاتاری فعال هست. ابتدا باید لاتاری قبلی رو ببندی.');
    }

    ctx.session.lotteryActive = true;
    ctx.session.ticketPrice = price;
    ctx.session.ticketUnit = 'capital';

    await ctx.telegram.sendMessage(config.channels.lottery,
        `🎉 لاتاری جدید آغاز شد!\n` +
        `💸 قیمت هر بلیط: ${price} ${config.manage.lottery.utils.capital}\n` +
        `🎟️ برای خرید بلیط روی دکمه زیر کلیک کنید و به ربات پیام دهید.`,
        {
            reply_markup: Markup.inlineKeyboard([
                [Markup.button.url('🎟️ شروع خرید بلیط', `https://t.me/${ctx.botInfo?.username}?start=lottery`)]
            ]).reply_markup,
            parse_mode: 'HTML'
        }
    );

    await ctx.reply('✅ لاتاری با قیمت سفارشی شروع شد.');
});

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

// Combined text handler for all lottery steps
lottery.on('text', async (ctx, next) => {
    if (ctx.session?.lotteryStep === 'awaiting_ticket_price') {
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

        await ctx.telegram.sendMessage(
            config.channels.lottery,
            `🎉 لاتاری جدید آغاز شد!\n` +
            `💸 قیمت هر بلیط: ${amount} ${config.manage.lottery.utils[unit]}\n` +
            `🎟️ برای خرید بلیط روی دکمه زیر کلیک کنید و به ربات پیام دهید.`,
            {
                reply_markup: Markup.inlineKeyboard([
                    [Markup.button.url('🎟️ شروع خرید بلیط', `https://t.me/${ctx.botInfo?.username}?start=lottery`)]
                ]).reply_markup,
                parse_mode: 'HTML'
            }
        );

        return ctx.reply('✅ لاتاری با موفقیت شروع شد.');
    }

    if (ctx.session?.lotteryStep === 'awaiting_ticket_count') {
        const count = Number(ctx.message.text);
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

        return ctx.reply(
            `✅ می‌خوای ${count} بلیط بخری به قیمت ${totalCost} ${config.manage.lottery.utils[ticketUnit]}؟`,
            {
                reply_markup: Markup.inlineKeyboard([
                    [Markup.button.callback('✅ تأیید خرید', 'confirm_ticket')],
                    [Markup.button.callback('❌ انصراف', 'cancel_ticket')]
                ]).reply_markup,
                parse_mode: 'HTML'
            }
        );
    }

    return next();
});

lottery.action('buy_ticket', async (ctx) => {
    if (!ctx.session?.lotteryActive) {
        return ctx.answerCbQuery('⛔ لاتاری فعالی وجود ندارد.');
    }

    const userTickets = ctx.user.lottery || 0;
    ctx.session.lotteryStep = 'awaiting_ticket_count';
    await ctx.reply(`🎟️ چند بلیط می‌خوای بخری؟\n\n📊 تعداد بلیط‌های فعلی شما: ${userTickets}`, {
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('1 بلیط', 'buy_ticket_1'), Markup.button.callback('5 بلیط', 'buy_ticket_5')],
            [Markup.button.callback('10 بلیط', 'buy_ticket_10'), Markup.button.callback('20 بلیط', 'buy_ticket_20')]
        ]).reply_markup
    });
});

lottery.action('buy_ticket_1', async (ctx) => {
    ctx.session.pendingTicketCount = 1;
    await ctx.reply('✅ می‌خوای 1 بلیط بخری به قیمت ' + ctx.session.ticketPrice + ' ' + config.manage.lottery.utils[ctx.session.ticketUnit] + '?', {
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('✅ تأیید خرید', 'confirm_ticket'), Markup.button.callback('❌ انصراف', 'cancel_ticket')]
        ]).reply_markup,
        parse_mode: 'HTML'
    });
});

lottery.action('buy_ticket_5', async (ctx) => {
    ctx.session.pendingTicketCount = 5;
    await ctx.reply('✅ می‌خوای 5 بلیط بخری به قیمت ' + ctx.session.ticketPrice * 5 + ' ' + config.manage.lottery.utils[ctx.session.ticketUnit] + '?', {
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('✅ تأیید خرید', 'confirm_ticket'), Markup.button.callback('❌ انصراف', 'cancel_ticket')]
        ]).reply_markup,
        parse_mode: 'HTML'
    });
});

lottery.action('buy_ticket_10', async (ctx) => {
    ctx.session.pendingTicketCount = 10;
    await ctx.reply('✅ می‌خوای 10 بلیط بخری به قیمت ' + ctx.session.ticketPrice * 10 + ' ' + config.manage.lottery.utils[ctx.session.ticketUnit] + '?', {
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('✅ تأیید خرید', 'confirm_ticket'), Markup.button.callback('❌ انصراف', 'cancel_ticket')]
        ]).reply_markup,
        parse_mode: 'HTML'
    });
});

lottery.action('buy_ticket_20', async (ctx) => {
    ctx.session.pendingTicketCount = 20;
    await ctx.reply('✅ می‌خوای 20 بلیط بخری به قیمت ' + ctx.session.ticketPrice * 20 + ' ' + config.manage.lottery.utils[ctx.session.ticketUnit] + '?', {
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('✅ تأیید خرید', 'confirm_ticket'), Markup.button.callback('❌ انصراف', 'cancel_ticket')]
        ]).reply_markup,
        parse_mode: 'HTML'
    });
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
        `<b>🎟️ خرید بلیط لاتاری! 🎟️</b>\n` +
        `<blockquote>کشور ${ctx.user.countryName} با خرید ${count} بلیط جدید، شانس خود را در لاتاری بزرگ جهانی افزایش داد!</blockquote>`
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

lottery.action('check_tickets', async (ctx) => {
    const userTickets = ctx.user.lottery || 0;
    await ctx.reply(`🎟️ تعداد بلیط‌های شما: ${userTickets}`, { parse_mode: 'HTML' });
});

/**
 * Admin action to end lottery
 */
lottery.action('admin_end_lottery', async (ctx) => {
    const adminId = ctx.from.id;
    if (!config.manage.lottery.admins.includes(adminId)) {
        return ctx.answerCbQuery('⛔ فقط ادمین می‌تونه لاتاری رو ببنده.');
    }
});

async function endLottery(ctx: CustomContext) {
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

    if (!ctx.session.ticketPrice || !ctx.session.ticketUnit) {
        return ctx.reply('❌ اطلاعات لاتاری ناقص است.');
    }

    const prize = pool.length * ctx.session.ticketPrice * 1000;

    await ctx.telegram.sendMessage(config.channels.lottery,
        `<b>🎊 برنده لاتاری بزرگ جهانی مشخص شد! 🎊</b>\n` +
        `پس از فروش ${pool.length} بلیط، قرعه‌کشی انجام شد و برنده خوش‌شانس این دوره مشخص گردید!\n` +
        `<blockquote>🏆 برنده: کشور ${winner.country} 🎟️ تعداد بلیط‌های برنده: ${winnerTickets}\n` +
        `💰 مبلغ جایزه: ${prize.toLocaleString()} دلار</blockquote>\n` +
        `تبریک به برنده بزرگ این دوره! منتظر دور بعدی لاتاری باشید.`,
        { parse_mode: 'HTML' }
    );

    await prisma.user.updateMany({ data: { lottery: 0 } });
    ctx.session = {};

    await ctx.reply('✅ لاتاری با موفقیت پایان یافت.');
}

export default lottery;