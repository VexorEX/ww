import { Telegraf } from 'telegraf';
import { prisma } from '../../prisma';
import { changeCapital } from '../economy';

export async function expirePendingRequests(bot: Telegraf) {
    const now = new Date();

    const expired = await prisma.pendingProductionLine.findMany({
        where: {
            expiresAt: { lt: now }
        }
    });

    for (const pending of expired) {
        const userId = pending.ownerId;
        const refund = Number(pending.setupCost);

        // بازگرداندن سرمایه
        const result = await changeCapital(userId, 'add', refund);
        if (result !== 'ok') {
            console.warn(`❌ خطا در بازگرداندن سرمایه برای کاربر ${userId}`);
            continue;
        }

        // اطلاع‌رسانی به کاربر
        try {
            await bot.telegram.sendMessage(
                userId.toString(),
                `⏳ پروژه "${pending.name}" پس از ۳ ساعت بدون پاسخ باقی ماند.\n💸 مبلغ ${Math.floor(refund / 1_000_000)}M به حساب شما برگشت داده شد.`
            );
        } catch (err) {
            console.warn(`❌ ارسال پیام به کاربر ${userId} ناموفق بود.`);
        }

        // بستن پیام ادمین (در صورت وجود)
        if (pending.adminChatId && pending.adminMessageId) {
            try {
                await bot.telegram.editMessageText(
                    pending.adminChatId.toString(),
                    pending.adminMessageId,
                    undefined,
                    '❌ این پروژه منقضی شده و بسته شد.'
                );
            } catch (err) {
                console.warn(`❌ ویرایش پیام ادمین ${pending.adminChatId} ناموفق بود.`);
            }
        }

        // حذف پروژه
        await prisma.pendingProductionLine.delete({ where: { id: pending.id } });
    }

    console.log(`✅ ${expired.length} پروژه منقضی‌شده پردازش شد.`);
}
