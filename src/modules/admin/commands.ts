import { Composer } from 'telegraf';
import type { CustomContext } from '../../middlewares/userAuth';
import { prisma } from '../../prisma';
import config from '../../config/config.json';
import fc from '../../config/fc.json';
import { getCountryByUserId } from "../../utils/countryUtils";
import path from "path";
import fs from "fs";

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
    const user = await prisma.user.findUnique({ where: { userid: userId } });
    if (!user) return ctx.reply('❌ کاربر یافت نشد.');

    try {
        // گرفتن کد کشور قبل از حذف
        const countryCode = await getCountryByUserId(Number(userId));

        // حذف کاربر از جدول user
        await prisma.user.delete({ where: { userid: userId } });

        // حذف داده‌های مرتبط
        await prisma.pendingProductionLine.deleteMany({ where: { ownerId: userId } });
        await prisma.productionLine.deleteMany({ where: { ownerId: userId } });

        // حذف کشور از fc.json
        if (countryCode && fc[countryCode]) {
            delete fc[countryCode];

            const fcPath = path.join(__dirname, '../config/fc.json');
            fs.writeFileSync(fcPath, JSON.stringify(fc, null, 2), 'utf-8');
        }

        return ctx.reply(`✅ اطلاعات کاربر ${userId} و کشور ${countryCode || 'نامشخص'} با موفقیت حذف شد.`);
    } catch (err) {
        console.error('❌ خطا در حذف کاربر:', err);
        return ctx.reply('❌ خطا در حذف کاربر. ممکن است کاربر وجود نداشته باشد.');
    }
});


export default adminCommands;
