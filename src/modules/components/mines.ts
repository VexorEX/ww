import { Composer, Markup } from 'telegraf';
import type { CustomContext } from '../../middlewares/userAuth';
import { changeCapital, changeUserField } from '../economy';
import { prisma } from '../../prisma';
import type { Prisma } from '../../generated/client';
import config from '../../config/config.json';

type User = Prisma.UserGetPayload<{}>;
const mines = new Composer<CustomContext>();

type MineType = 'iron' | 'gold' | 'oil' | 'uranium';

const mineSpecs: Record<MineType, {
    label: string;
    field: keyof User;
    resource: keyof User;
    maxCount: number;
    dailyOutput: number;
    cost: number;
}> = {
    iron: { label: '⛏ معدن آهن', field: 'ironMine', resource: 'iron', maxCount: 3, dailyOutput: 300, cost: 550_000_000 },
    gold: { label: '🏆 معدن طلا', field: 'goldMine', resource: 'gold', maxCount: 3, dailyOutput: 150, cost: 850_000_000 },
    oil: { label: '🛢 پالایشگاه نفت', field: 'refinery', resource: 'oil', maxCount: 3, dailyOutput: 150, cost: 655_000_000 },
    uranium: { label: '☢️ معدن اورانیوم', field: 'uraniumMine', resource: 'uranium', maxCount: 3, dailyOutput: 10, cost: 1_000_000_000 }
};

// 📌 مدیریت معادن
mines.action('manage_mines', async (ctx) => {
    const user = ctx.user;
    const rows: any[] = [];

    for (const [type, spec] of Object.entries(mineSpecs) as [MineType, typeof mineSpecs[MineType]][]) {
        const current = typeof user[spec.field] === 'bigint' ? Number(user[spec.field]) : Number(user[spec.field] ?? 0);
        rows.push([
            Markup.button.callback(spec.label, 'noop'),
            Markup.button.callback(`📦 ${spec.dailyOutput}/روز`, 'noop'),
            Markup.button.callback(`💰 ${spec.cost / 1_000_000}M`, 'noop'),
            Markup.button.callback(`🔢 ${current}/${spec.maxCount}`, 'noop'),
            Markup.button.callback('🛠 احداث', `mine_build_${type}`)
        ]);
    }

    rows.push([Markup.button.callback('🔙 بازگشت', 'back_main')]);
    await ctx.editMessageText('🏗 اطلاعات معادن و گزینه‌های احداث:', {
        reply_markup: Markup.inlineKeyboard(rows).reply_markup
    });
});

// 🛠 احداث معدن
for (const type of Object.keys(mineSpecs) as MineType[]) {
    mines.action(`mine_build_${type}`, async (ctx) => {
        const user = ctx.user;
        const userId = user.userid;
        const spec = mineSpecs[type];
        const current = user[spec.field] as number;

        if (current >= spec.maxCount) {
            return ctx.answerCbQuery(`⛔️ شما قبلاً ${spec.maxCount} عدد ${spec.label} دارید.`);
        }

        const requiredCapital = BigInt(spec.cost);
        if (user.capital < requiredCapital) {
            return ctx.answerCbQuery(
                `❌ سرمایه کافی ندارید.\n` +
                `💰 مورد نیاز: ${spec.cost / 1_000_000}M\n` +
                `💳 موجودی: ${Number(user.capital) / 1_000_000}M`,
                { show_alert: true }
            );
        }

        const capitalResult = await changeCapital(userId, 'subtract', spec.cost);
        const mineResult = await changeUserField(userId, spec.field as string, 'add', 1);

        if (capitalResult !== 'ok' || mineResult !== 'ok') {
            return ctx.answerCbQuery('❌ خطا در احداث معدن.');
        }

        await ctx.answerCbQuery(`✅ ${spec.label} ساخته شد.`);
        await ctx.editMessageText(`✅ ${spec.label} با موفقیت ساخته شد.\nبرای ادامه، دوباره دکمه "مدیریت معادن" را بزن.`);
    });
}

// 📦 سود روزانه برای یک کاربر
export async function applyDailyMineProfit(userid: bigint): Promise<'ok' | 'error'> {
    try {
        const user = await prisma.user.findUnique({ where: { userid } });
        if (!user) return 'error';

        for (const [type, spec] of Object.entries(mineSpecs) as [MineType, typeof mineSpecs[MineType]][]) {
            const rawCount = user[spec.field];
            const count = typeof rawCount === 'bigint' ? Number(rawCount) : Number(rawCount ?? 0);
            const total = count * spec.dailyOutput;
            if (total > 0) {
                const result = await changeUserField(userid, spec.resource as string, 'add', total);
                if (result !== 'ok') {
                    console.warn(`❌ خطا در واریز ${spec.resource} برای کاربر ${userid}`);
                }
            }
        }

        return 'ok';
    } catch (err) {
        console.error('❌ applyDailyMineProfit error:', err);
        return 'error';
    }
}

// 📦 سود روزانه برای همه کاربران
export async function applyDailyMineProfitForAllUsers(): Promise<'ok' | 'error'> {
    try {
        const users = await prisma.user.findMany({ select: { userid: true } });
        for (const user of users) {
            await applyDailyMineProfit(user.userid);
        }
        return 'ok';
    } catch (err) {
        console.error('❌ applyDailyMineProfitForAllUsers error:', err);
        return 'error';
    }
}

// 🧮 دستور ادمینی: سود معادن یک کاربر
mines.command('mineprofit', async (ctx) => {
    const adminId = ctx.from.id;
    if (!config.manage.buildings.mines.admins.includes(adminId)) {
        return ctx.reply('⛔ فقط ادمین‌ها می‌تونن این دستور رو اجرا کنن.');
    }

    const args = ctx.message.text.split(' ');
    const targetId = args[1] ? BigInt(args[1]) : BigInt(ctx.from.id);
    const user = await prisma.user.findUnique({ where: { userid: targetId } });
    if (!user) return ctx.reply('❌ کاربر یافت نشد.');

    let report: string[] = [];

    for (const [type, spec] of Object.entries(mineSpecs) as [MineType, typeof mineSpecs[MineType]][]) {
        const rawCount = user[spec.field];
        const count = typeof rawCount === 'bigint' ? Number(rawCount) : Number(rawCount ?? 0);
        const total = count * spec.dailyOutput;

        if (total > 0) {
            const result = await changeUserField(targetId, spec.resource as string, 'add', total);
            if (result === 'ok') {
                report.push(`✅ ${spec.label}: ${count} معدن × ${spec.dailyOutput} → +${total} ${spec.resource}`);
            } else {
                report.push(`❌ خطا در واریز ${spec.resource}`);
            }
        } else {
            report.push(`➖ ${spec.label}: هیچ معدنی ندارید`);
        }
    }

    await ctx.reply(`📦 سود معادن برای کاربر ${targetId} اعمال شد:\n` + report.join('\n'));
});
// 🧮 دستور ادمینی: سود معادن همه کاربران
mines.command('mineprofit_all', async (ctx) => {
    const adminId = ctx.from.id;
    if (!config.manage.buildings.mines.admins.includes(adminId)) {
        return ctx.reply('⛔ فقط ادمین‌ها می‌تونن این دستور رو اجرا کنن.');
    }

    const users = await prisma.user.findMany({ select: { userid: true } });
    let successCount = 0;
    let errorCount = 0;

    for (const user of users) {
        const result = await applyDailyMineProfit(user.userid);
        if (result === 'ok') successCount++;
        else errorCount++;
    }

    await ctx.reply(
        `📊 سود معادن برای همه کاربران اعمال شد.\n` +
        `✅ موفق: ${successCount} کاربر\n` +
        `❌ خطا: ${errorCount} کاربر`
    );
});

export default mines;
