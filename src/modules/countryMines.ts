import { Composer, Markup } from 'telegraf';
import type { CustomContext } from '../middlewares/userAuth';
import { changeCapital, changeUserField } from './economy';
import { prisma } from '../prisma';
import type { Prisma } from '../generated/client';

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
    iron: {
        label: '⛏ معدن آهن',
        field: 'ironMine',
        resource: 'iron',
        maxCount: 3,
        dailyOutput: 300,
        cost: 550_000_000
    },
    gold: {
        label: '🏆 معدن طلا',
        field: 'goldMine',
        resource: 'gold',
        maxCount: 3,
        dailyOutput: 150,
        cost: 850_000_000
    },
    oil: {
        label: '🛢 پالایشگاه نفت',
        field: 'refinery',
        resource: 'oil',
        maxCount: 3,
        dailyOutput: 150,
        cost: 655_000_000
    },
    uranium: {
        label: '☢️ معدن اورانیوم',
        field: 'uraniumMine',
        resource: 'uranium',
        maxCount: 3,
        dailyOutput: 10,
        cost: 1_000_000_000
    }
};

// دکمه اصلی مدیریت معادن
mines.action('manage_mines', async (ctx) => {
    const user = ctx.user;

    const rows = Object.entries(mineSpecs).map(([type, spec]) => {
        const current = user[spec.field as keyof User] as number;
        const label = `${spec.label} (${current}/${spec.maxCount})`;
        return [Markup.button.callback(label, `mine_build_${type}`)];
    });

    rows.push([Markup.button.callback('🔙 بازگشت', 'back_main')]);

    await ctx.editMessageText('🏗 انتخاب نوع معدن یا پالایشگاه برای احداث:', {
        reply_markup: Markup.inlineKeyboard(rows).reply_markup
    });
});

// احداث معدن با دکمه
for (const type of Object.keys(mineSpecs) as MineType[]) {
    mines.action(`mine_build_${type}`, async (ctx) => {
        const user = ctx.user;
        const userId = user.userid;
        const spec = mineSpecs[type];
        const current = user[spec.field as keyof User] as number;

        if (current >= spec.maxCount) {
            await ctx.answerCbQuery(`⛔️ شما قبلاً ${spec.maxCount} عدد ${spec.label} دارید.`);
            return;
        }

        if (user.capital < BigInt(spec.cost)) {
            await ctx.answerCbQuery(
                `❌ سرمایه کافی ندارید.\n` +
                `💰 مورد نیاز: ${spec.cost / 1_000_000}M\n` +
                `💳 موجودی: ${Number(user.capital / BigInt(1_000_000)).toLocaleString()}M`,
                { show_alert: true }
            );
            return;
        }

        const capitalResult = await changeCapital(userId, 'subtract', spec.cost);
        const mineResult = await changeUserField(userId, spec.field as string, 'add', 1);

        if (capitalResult !== 'ok' || mineResult !== 'ok') {
            await ctx.answerCbQuery('❌ خطا در احداث معدن.');
            return;
        }

        await ctx.answerCbQuery(`✅ ${spec.label} ساخته شد.`);
        await ctx.editMessageText(`✅ ${spec.label} با موفقیت ساخته شد.\nبرای ادامه، دوباره دکمه "مدیریت معادن" را بزن.`);
    });
}

// تولید روزانه منابع برای همه کاربران
export async function applyDailyMineProfit(userid: bigint): Promise<'ok' | 'error'> {
    try {
        const user = await prisma.user.findUnique({ where: { userid } });
        if (!user) return 'error';

        for (const type of Object.keys(mineSpecs) as MineType[]) {
            const spec = mineSpecs[type];
            const count = user[spec.field] as number;
            const total = count * spec.dailyOutput;

            if (total > 0) {
                await changeUserField(user.userid, spec.resource as string, 'add', total);
            }
        }

        return 'ok';
    } catch (err) {
        console.error('❌ applyDailyMineProfit error:', err);
        return 'error';
    }
}
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


export default mines;
