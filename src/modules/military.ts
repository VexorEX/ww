import { Composer } from 'telegraf';
import { prisma } from '../prisma';
import type { User } from '../generated/client';
import { formatNumber } from '../utils/formatters';
import type { CustomContext } from '../middlewares/userAuth';

const military = new Composer<CustomContext>();

// Helper: خرید generic برای واحدها (سرباز، تانک، etc.)
async function buyUnit(ctx: CustomContext, unitKey: keyof User, costIron: number, costOil: number, count = 1, userId: number) {
    const totalIron = costIron * count;
    const totalOil = costOil * count;
    const user = await prisma.user.findUnique({ where: { userid: userId } });

    if (!user || user.iron < totalIron || user.oil < totalOil) {
        return ctx.reply('❌ منابع (آهن/نفت) کافی نیست!');
    }

    await prisma.user.update({
        where: { userid: userId },
        data: {
            iron: { decrement: totalIron },
            oil: { decrement: totalOil },
            [unitKey]: { increment: count },
        },
    });
    return ctx.reply(`✅ ${count} ${unitKey} خریداری شد! (آهن: -${totalIron}, نفت: -${totalOil})`);
}

// /military - نمایش کامل ارتش
military.command('military', async (ctx) => {
    const {
        soldier, tank, heavyTank,
        su57, f47, f35, j20, f16, f22, am50, b2, tu16, // fighters
        espionageDrone, suicideDrone, crossDrone, witnessDrone, // drons
        simpleRocket, crossRocket, dotTargetRocket, continentalRocket, ballisticRocket, chemicalRocket, hyperSonicRocket, clusterRocket, // rockets
        battleship, marineShip, breakerShip, nuclearSubmarine, // naval
        antiRocket, ironDome, s400, taad, hq9, acash // defense
    } = ctx.user;

    let msg = `⚔️ وضعیت ارتش:\n`;
    msg += `پایه:\nسرباز: ${formatNumber(soldier)}\nتانک: ${formatNumber(tank)}\nتانک سنگین: ${formatNumber(heavyTank)}\n\n`;
    msg += `جنگنده‌ها:\nSu-57: ${formatNumber(su57)} | F-47: ${formatNumber(f47)}\nF-35: ${formatNumber(f35)} | J-20: ${formatNumber(j20)}\nF-16: ${formatNumber(f16)} | F-22: ${formatNumber(f22)}\nAM-50: ${formatNumber(am50)} | B-2: ${formatNumber(b2)} | TU-16: ${formatNumber(tu16)}\n\n`;
    msg += `پهپادها:\nجاسوسی: ${formatNumber(espionageDrone)} | انتحاری: ${formatNumber(suicideDrone)}\nضرب: ${formatNumber(crossDrone)} | شاهد: ${formatNumber(witnessDrone)}\n\n`;
    msg += `موشک‌ها:\nساده: ${formatNumber(simpleRocket)} | ضرب: ${formatNumber(crossRocket)}\nنقطه‌زن: ${formatNumber(dotTargetRocket)} | قاره‌پیما: ${formatNumber(continentalRocket)}\nبالستیک: ${formatNumber(ballisticRocket)} | شیمیایی: ${formatNumber(chemicalRocket)}\nهایپرسونیک: ${formatNumber(hyperSonicRocket)} | خوشه‌ای: ${formatNumber(clusterRocket)}\n\n`;
    msg += `دریایی:\nنبرد دریایی: ${formatNumber(battleship)} | دریایی: ${formatNumber(marineShip)}\nشکن: ${formatNumber(breakerShip)} | زیردریایی هسته‌ای: ${formatNumber(nuclearSubmarine)}\n\n`;
    msg += `دفاع:\nضد موشک: ${formatNumber(antiRocket)} | گنبد آهنین: ${formatNumber(ironDome)}\nS-400: ${formatNumber(s400)} | TAAD: ${formatNumber(taad)}\nHQ-9: ${formatNumber(hq9)} | A-CASH: ${formatNumber(acash)}`;

    ctx.reply(msg);
});

// /buysoldier - خرید سرباز (150 آهن + 150 نفت per unit)
military.command('buysoldier', async (ctx) => {
    const count = parseInt(ctx.message.text.split(' ')[1]) || 1;
    await buyUnit(ctx, 'soldier', 150, 150, count, ctx.from.id);
});

// /buytank - تانک (500 آهن + 200 نفت)
military.command('buytank', async (ctx) => {
    const count = parseInt(ctx.message.text.split(' ')[1]) || 1;
    await buyUnit(ctx, 'tank', 500, 200, count, ctx.from.id);
});

// /buyheavytank - تانک سنگین (1000 آهن + 500 نفت)
military.command('buyheavytank', async (ctx) => {
    const count = parseInt(ctx.message.text.split(' ')[1]) || 1;
    await buyUnit(ctx, 'heavyTank', 1000, 500, count, ctx.from.id);
});

// مثال برای جنگنده (هزینه بالاتر، مثلاً Su-57: 10000 آهن + 5000 نفت)
military.command('buysu57', async (ctx) => {
    const count = parseInt(ctx.message.text.split(' ')[1]) || 1;
    await buyUnit(ctx, 'su57', 10000, 5000, count, ctx.from.id);
});

// برای بقیه fighter ها مشابه بنویس (f47, f35, etc.) - کپی کن و unitKey و هزینه‌ها رو تغییر بده

// /train - آموزش/تولید واحدها (مثلاً +10% به soldier بر اساس satisfaction)
// military.command('train', async (ctx) => {
//     const { userid, satisfaction, soldier, tank /* etc. */ } = ctx.user;
//     if (satisfaction < 50) return ctx.reply('❌ رضایت کمه! حداقل 50% نیازه.');
//
//     const boost = Math.floor(satisfaction / 10); // مثلاً 8% boost per 10 satisfaction
//     await prisma.user.update({
//         where: { userid },
//         data: {
//             soldier: { increment: soldier * boost / 100 },
//             tank: { increment: tank * boost / 100 },
//             // برای بقیه واحدها اضافه کن
//         },
//     });
//     ctx.reply(`🏋️ آموزش: +${boost}% به واحدها (بر اساس رضایت ${satisfaction}%)`);
// });

// برای پهپاد، موشک، دریایی، دفاع: handler های مشابه buyUnit بساز، اما با هزینه‌های متفاوت (مثل gold برای پیشرفته‌ها)

export default military;