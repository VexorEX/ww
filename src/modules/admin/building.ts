import { Composer } from 'telegraf';
import type { CustomContext } from '../../middlewares/userAuth';
import { prisma } from '../../prisma';
import config from '../../config/config.json';
import { changeCapital } from '../economy';

const admin = new Composer<CustomContext>();
const admins: number[] = config.manage.buildings.admins;

admin.action(/^admin_approve_building_(\d+)$/, async (ctx) => {
    const userId = BigInt(ctx.match[1]);
    const pending = await prisma.pendingProductionLine.findUnique({ where: { ownerId: userId } });
    if (!pending) return ctx.reply('❌ درخواست یافت نشد.');

    await prisma.productionLine.create({
        data: {
            ownerId: userId,
            name: pending.name,
            type: pending.type,
            imageUrl: pending.imageUrl,
            dailyLimit: pending.dailyLimit,
            setupCost: pending.setupCost,
            country: pending.country,
            carName: pending.type === 'car' ? pending.name : null,
            unitPrice: pending.type === 'car' ? Math.floor(10_000_000 + Math.random() * 8_000_000) : null,
            profitPercent: pending.profitPercent
        }
    });

    await prisma.pendingProductionLine.delete({ where: { ownerId: userId } });
    await ctx.reply('✅ پروژه تأیید شد و ثبت گردید.');
});

admin.action(/^admin_reject_building_(\d+)$/, async (ctx) => {
    const userId = BigInt(ctx.match[1]);
    const adminId = ctx.from.id;
    if (!admins.includes(adminId)) return ctx.answerCbQuery('⛔ فقط ادمین می‌تونه رد کنه.');

    const pending = await prisma.pendingProductionLine.findUnique({ where: { ownerId: userId } });
    if (!pending) return ctx.answerCbQuery('❌ درخواست یافت نشد.');

    await changeCapital(userId, 'add', Number(pending.setupCost));
    await prisma.pendingProductionLine.delete({ where: { ownerId: userId } });

    await ctx.telegram.sendMessage(Number(userId), `❌ درخواست ساخت "${pending.name}" رد شد و مبلغ ${Number(pending.setupCost / BigInt(1_000_000)).toLocaleString()}M برگشت.`);
    await ctx.answerCbQuery('✅ درخواست رد شد.');
});

export default admin;
