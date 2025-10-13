"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const prisma_1 = require("../prisma");
const formatters_1 = require("../utils/formatters");
const military = new telegraf_1.Composer();
async function buyUnit(ctx, unitKey, costIron, costOil, count = 1, userId) {
    const totalIron = costIron * count;
    const totalOil = costOil * count;
    const user = await prisma_1.prisma.user.findUnique({ where: { userid: userId } });
    if (!user || user.iron < totalIron || user.oil < totalOil) {
        return ctx.reply('❌ منابع (آهن/نفت) کافی نیست!');
    }
    await prisma_1.prisma.user.update({
        where: { userid: userId },
        data: {
            iron: { decrement: totalIron },
            oil: { decrement: totalOil },
            [unitKey]: { increment: count },
        },
    });
    return ctx.reply(`✅ ${count} ${unitKey} خریداری شد! (آهن: -${totalIron}, نفت: -${totalOil})`);
}
military.command('military', async (ctx) => {
    const { soldier, tank, heavyTank, su57, f47, f35, j20, f16, f22, am50, b2, tu16, espionageDrone, suicideDrone, crossDrone, witnessDrone, simpleRocket, crossRocket, dotTargetRocket, continentalRocket, ballisticRocket, chemicalRocket, hyperSonicRocket, clusterRocket, battleship, marineShip, breakerShip, nuclearSubmarine, antiRocket, ironDome, s400, taad, hq9, acash } = ctx.user;
    let msg = `⚔️ وضعیت ارتش:\n`;
    msg += `پایه:\nسرباز: ${(0, formatters_1.formatNumber)(soldier)}\nتانک: ${(0, formatters_1.formatNumber)(tank)}\nتانک سنگین: ${(0, formatters_1.formatNumber)(heavyTank)}\n\n`;
    msg += `جنگنده‌ها:\nSu-57: ${(0, formatters_1.formatNumber)(su57)} | F-47: ${(0, formatters_1.formatNumber)(f47)}\nF-35: ${(0, formatters_1.formatNumber)(f35)} | J-20: ${(0, formatters_1.formatNumber)(j20)}\nF-16: ${(0, formatters_1.formatNumber)(f16)} | F-22: ${(0, formatters_1.formatNumber)(f22)}\nAM-50: ${(0, formatters_1.formatNumber)(am50)} | B-2: ${(0, formatters_1.formatNumber)(b2)} | TU-16: ${(0, formatters_1.formatNumber)(tu16)}\n\n`;
    msg += `پهپادها:\nجاسوسی: ${(0, formatters_1.formatNumber)(espionageDrone)} | انتحاری: ${(0, formatters_1.formatNumber)(suicideDrone)}\nضرب: ${(0, formatters_1.formatNumber)(crossDrone)} | شاهد: ${(0, formatters_1.formatNumber)(witnessDrone)}\n\n`;
    msg += `موشک‌ها:\nساده: ${(0, formatters_1.formatNumber)(simpleRocket)} | ضرب: ${(0, formatters_1.formatNumber)(crossRocket)}\nنقطه‌زن: ${(0, formatters_1.formatNumber)(dotTargetRocket)} | قاره‌پیما: ${(0, formatters_1.formatNumber)(continentalRocket)}\nبالستیک: ${(0, formatters_1.formatNumber)(ballisticRocket)} | شیمیایی: ${(0, formatters_1.formatNumber)(chemicalRocket)}\nهایپرسونیک: ${(0, formatters_1.formatNumber)(hyperSonicRocket)} | خوشه‌ای: ${(0, formatters_1.formatNumber)(clusterRocket)}\n\n`;
    msg += `دریایی:\nنبرد دریایی: ${(0, formatters_1.formatNumber)(battleship)} | دریایی: ${(0, formatters_1.formatNumber)(marineShip)}\nشکن: ${(0, formatters_1.formatNumber)(breakerShip)} | زیردریایی هسته‌ای: ${(0, formatters_1.formatNumber)(nuclearSubmarine)}\n\n`;
    msg += `دفاع:\nضد موشک: ${(0, formatters_1.formatNumber)(antiRocket)} | گنبد آهنین: ${(0, formatters_1.formatNumber)(ironDome)}\nS-400: ${(0, formatters_1.formatNumber)(s400)} | TAAD: ${(0, formatters_1.formatNumber)(taad)}\nHQ-9: ${(0, formatters_1.formatNumber)(hq9)} | A-CASH: ${(0, formatters_1.formatNumber)(acash)}`;
    ctx.reply(msg);
});
military.command('buysoldier', async (ctx) => {
    const count = parseInt(ctx.message.text.split(' ')[1]) || 1;
    await buyUnit(ctx, 'soldier', 150, 150, count, ctx.from.id);
});
military.command('buytank', async (ctx) => {
    const count = parseInt(ctx.message.text.split(' ')[1]) || 1;
    await buyUnit(ctx, 'tank', 500, 200, count, ctx.from.id);
});
military.command('buyheavytank', async (ctx) => {
    const count = parseInt(ctx.message.text.split(' ')[1]) || 1;
    await buyUnit(ctx, 'heavyTank', 1000, 500, count, ctx.from.id);
});
military.command('buysu57', async (ctx) => {
    const count = parseInt(ctx.message.text.split(' ')[1]) || 1;
    await buyUnit(ctx, 'su57', 10000, 5000, count, ctx.from.id);
});
military.command('train', async (ctx) => {
    const { userid, satisfaction, soldier, tank } = ctx.user;
    if (satisfaction < 50)
        return ctx.reply('❌ رضایت کمه! حداقل 50% نیازه.');
    const boost = Math.floor(satisfaction / 10);
    await prisma_1.prisma.user.update({
        where: { userid },
        data: {
            soldier: { increment: soldier * boost / 100 },
            tank: { increment: tank * boost / 100 },
        },
    });
    ctx.reply(`🏋️ آموزش: +${boost}% به واحدها (بر اساس رضایت ${satisfaction}%)`);
});
exports.default = military;
