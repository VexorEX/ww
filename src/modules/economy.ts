import { Composer } from 'telegraf';
import { prisma } from '../prisma';
import type { CustomContext } from '../middlewares/userAuth';

const economy = new Composer<CustomContext>();

// // Helper: خرید generic (برای معدن، پالایشگاه، etc.)
// async function buyItem(ctx: CustomContext, itemKey: keyof Pick<User, 'ironMine' | 'goldMine' | 'uraniumMine' | 'refinery'>, cost: bigint, userId: number) {
//     const user = await prisma.user.findUnique({ where: { userid: userId } });
//     if (!user || user.capital < cost) {
//         return ctx.reply('❌ سرمایه یا منابع کافی نیست!');
//     }
//
//     await prisma.user.update({
//         where: { userid: userId },
//         data: {
//             capital: { decrement: cost },
//             [itemKey]: { increment: 1 },
//         },
//     });
//     return ctx.reply(`✅ ${itemKey} خریداری شد! (هزینه: ${formatNumber(cost)})`);
// }
//
// // /economy - نمایش کامل اقتصاد
// economy.command('economy', async (ctx) => {
//     const { crowd, capital, dailyProfit, satisfaction, security, lottery, oil, iron, gold, uranium, goldMine, uraniumMine, ironMine, refinery } = ctx.user;
//     ctx.reply(
//         `📊 وضعیت اقتصاد:\n` +
//         `جمعیت: ${formatNumber(crowd)}\n` +
//         `سرمایه: ${formatNumber(capital)}\n` +
//         `سود روزانه: ${formatNumber(dailyProfit)}\n` +
//         `رضایت: ${satisfaction}%\n` +
//         `امنیت: ${security}%\n` +
//         `لوتری: ${lottery}\n\n` +
//         `منابع:\n` +
//         `نفت: ${formatNumber(oil)}\n` +
//         `آهن: ${formatNumber(iron)}\n` +
//         `طلا: ${formatNumber(gold)}\n` +
//         `اورانیوم: ${formatNumber(uranium)}\n\n` +
//         `تولیدکننده‌ها:\n` +
//         `معدن آهن: ${ironMine}\n` +
//         `معدن طلا: ${goldMine}\n` +
//         `معدن اورانیوم: ${uraniumMine}\n` +
//         `پالایشگاه: ${refinery}`
//     );
// });
//
// // /daily - سود + تولید منابع (بر اساس معادن و refinery)
// economy.command('daily', async (ctx) => {
//     const { userid, dailyProfit, ironMine, goldMine, uraniumMine, refinery } = ctx.user;
//     const productionIron = BigInt(ironMine * 1000); // مثلاً 1000 آهن per mine
//     const productionGold = BigInt(goldMine * 500);
//     const productionUranium = BigInt(uraniumMine * 200);
//     const productionOil = BigInt(refinery * 2000); // نفت از پالایشگاه
//
//     await prisma.user.update({
//         where: { userid },
//         data: {
//             capital: { increment: dailyProfit },
//             iron: { increment: Number(productionIron) }, // Prisma BigInt رو به number تبدیل می‌کنه اگر لازم
//             gold: { increment: Number(productionGold) },
//             uranium: { increment: Number(productionUranium) },
//             oil: { increment: Number(productionOil) },
//             lottery: { increment: 1 }, // هر روز یک بلیت
//         },
//     });
//     ctx.reply(
//         `💰 سود روزانه ${formatNumber(dailyProfit)} اضافه شد!\n` +
//         `⛏️ تولید:\nآهن: +${formatNumber(productionIron)}\nطلا: +${formatNumber(productionGold)}\n` +
//         `اورانیوم: +${formatNumber(productionUranium)}\nنفت: +${formatNumber(productionOil)}\n` +
//         `🎟️ بلیت لوتری +1`
//     );
// });
//
// // /buymine - خرید معدن (آهن/طلا/اورانیوم)
// economy.command('buymine', async (ctx) => {
//     const args = ctx.message.text.split(' ');
//     if (args.length < 2) return ctx.reply('استفاده: /buymine iron (gold/uranium)');
//
//     const type = args[1].toLowerCase();
//     const cost = 50000000n; // 50 میلیون
//     const userId = ctx.from.id;
//
//     let itemKey: keyof Pick<User, 'ironMine' | 'goldMine' | 'uraniumMine'>;
//     if (type === 'iron') itemKey = 'ironMine';
//     else if (type === 'gold') itemKey = 'goldMine';
//     else if (type === 'uranium') itemKey = 'uraniumMine';
//     else return ctx.reply('❌ نوع معدن: iron/gold/uranium');
//
//     await buyItem(ctx, itemKey, cost, userId);
// });
//
// // /buyrefinery - خرید پالایشگاه
// economy.command('buyrefinery', async (ctx) => {
//     const cost = 100000000n; // 100 میلیون
//     await buyItem(ctx, 'refinery', cost, ctx.from.id);
// });
//
// // /lottery - استفاده از بلیت‌ها (شانس 10% برنده 1 میلیارد)
// economy.command('lottery', async (ctx) => {
//     const { userid, lottery } = ctx.user;
//     if (lottery <= 0) return ctx.reply('❌ بلیت ندارید! هر روز /daily بگیرید.');
//
//     const chance = Math.random() < 0.1; // 10% شانس
//     let prize = 0n;
//     if (chance) {
//         prize = 1000000000n;
//         await prisma.user.update({
//             where: { userid },
//             data: { capital: { increment: prize }, lottery: { decrement: 1 } },
//         });
//         ctx.reply(`🎉 برنده شدید! +${formatNumber(prize)} سرمایه`);
//     } else {
//         await prisma.user.update({ where: { userid }, data: { lottery: { decrement: 1 } } });
//         ctx.reply('😔 شانس نیاوردید. بلیت مصرف شد.');
//     }
// });
//
// // /boost - افزایش satisfaction/security (هزینه 10 میلیون per %)
// economy.command('boost', async (ctx) => {
//     const args = ctx.message.text.split(' ');
//     if (args.length < 2) return ctx.reply('استفاده: /boost satisfaction (security) [مقدار]');
//
//     const type = args[1].toLowerCase();
//     const amount = parseInt(args[2]) || 5;
//     const cost = BigInt(10000000 * amount);
//     const userId = ctx.from.id;
//
//     const user = await prisma.user.findUnique({ where: { userid: userId } });
//     if (!user || user.capital < cost) return ctx.reply('❌ سرمایه کافی نیست!');
//
//     let updateData: any = { capital: { decrement: cost } };
//     if (type === 'satisfaction') updateData.satisfaction = { increment: amount };
//     else if (type === 'security') updateData.security = { increment: amount };
//     else return ctx.reply('❌ نوع: satisfaction/security');
//
//     await prisma.user.update({ where: { userid: userId }, data: updateData });
//     ctx.reply(`📈 ${type} +${amount}% (هزینه: ${formatNumber(cost)})`);
// });
//

type Operation =
    | 'add'
    | 'subtract'
    | 'multiply'
    | 'divide'
    | 'mod'
    | 'power'
    | 'floor'
    | 'ceil'
    | 'round'
    | 'sqrt'
    | 'set';

export async function changeCapital(
    userid: bigint,
    operation: Operation,
    value: number
): Promise<'ok' | 'not_found' | 'invalid' | 'error'> {
    try {
        const user = await prisma.user.findUnique({ where: { userid } });
        if (!user) return 'not_found';

        let result = user.capital;

        switch (operation) {
            case 'add':
                result += BigInt(value);
                break;
            case 'subtract':
                result -= BigInt(value);
                break;
            case 'multiply':
                result *= BigInt(value);
                break;
            case 'divide':
                if (value === 0) return 'invalid';
                result /= BigInt(value);
                break;
            case 'mod':
                result %= BigInt(value);
                break;
            case 'power':
                result = BigInt(Math.pow(Number(result), value));
                break;
            case 'floor':
                result = BigInt(Math.floor(Number(result)));
                break;
            case 'ceil':
                result = BigInt(Math.ceil(Number(result)));
                break;
            case 'round':
                result = BigInt(Math.round(Number(result)));
                break;
            case 'sqrt':
                result = BigInt(Math.floor(Math.sqrt(Number(result))));
                break;
            case 'set':
                result = BigInt(value);
                break;
            default:
                return 'invalid';
        }


        await prisma.user.update({
            where: { userid },
            data: { capital: BigInt(result) }
        });

        return 'ok';
    } catch (err) {
        console.error('❌ changeCapital error:', err);
        return 'error';
    }
}




export default economy;