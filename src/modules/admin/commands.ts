import { Composer } from 'telegraf';
import type { CustomContext } from '../../middlewares/userAuth';
import { prisma } from '../../prisma';
import config from '../../config/config.json';

const adminCommands = new Composer<CustomContext>();

// لیست ادمین‌ها از config
const ADMIN_IDS: number[] = config.manage.country.admins || [];

// دستور حذف کامل کاربر
adminCommands.command('remuser', async (ctx) => {
    const adminId = ctx.from.id;
    if (!ADMIN_IDS.includes(adminId)) {
        return ctx.reply('⛔ شما دسترسی ادمین ندارید.');
    }

    const args = ctx.message.text.split(' ');
    const userIdStr = args[1];

    if (!userIdStr || !/^\d+$/.test(userIdStr)) {
        return ctx.reply('❌ لطفاً شناسه کاربر را به‌درستی وارد کنید.\nمثال: /remuser 123456789');
    }

    const userId = BigInt(userIdStr);

    try {
        // حذف کاربر از جدول user
        await prisma.user.delete({ where: { userid: userId } });

        // اگر جدول‌های مرتبط دیگه‌ای هم داری (مثلاً productionLine یا session)، اینجا حذف کن
        await prisma.pendingProductionLine.deleteMany({ where: { ownerId: userId } });
        await prisma.productionLine.deleteMany({ where: { ownerId: userId } });

        return ctx.reply(`✅ اطلاعات کاربر ${userId} با موفقیت حذف شد.`);
    } catch (err) {
        console.error('❌ خطا در حذف کاربر:', err);
        return ctx.reply('❌ خطا در حذف کاربر. ممکن است کاربر وجود نداشته باشد.');
    }
});

export default adminCommands;
