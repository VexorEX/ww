import config from '../../config/config.json';
import {Composer} from "telegraf";
import type {CustomContext} from "../../middlewares/userAuth";
import { prisma } from "../../prisma";

const perm = new Composer<CustomContext>();

perm.command('ban', async (ctx) => {
    const adminId = ctx.from.id;
    if (!config.manage.admins.includes(adminId)) {
        return ctx.reply('⛔ فقط ادمین‌ها می‌تونن بن کنن.');
    }

    const args = ctx.message.text.split(' ');
    const targetId = args[1];

    if (!targetId || isNaN(Number(targetId))) {
        return ctx.reply('❌ فرمت صحیح: /ban <userid>');
    }

    try {
        const user = await prisma.user.findUnique({
            where: { userid: BigInt(targetId) }
        });

        if (!user) {
            return ctx.reply(`❌ کاربر با شناسه ${targetId} یافت نشد.`);
        }

        await prisma.user.update({
            where: { userid: BigInt(targetId) },
            data: { banned: true }
        });

        await ctx.reply(`✅ کاربر ${targetId} بن شد.`);
    } catch (error) {
        console.error('Error banning user:', error);
        await ctx.reply(`❌ خطایی در بن کردن کاربر رخ داد: ${error.message}`);
    }
});

perm.command('unban', async (ctx) => {
    const adminId = ctx.from.id;
    if (!config.manage.admins.includes(adminId)) {
        return ctx.reply('⛔ فقط ادمین‌ها می‌تونن آن‌بن کنن.');
    }

    const args = ctx.message.text.split(' ');
    const targetId = args[1];

    if (!targetId || isNaN(Number(targetId))) {
        return ctx.reply('❌ فرمت صحیح: /unban <userid>');
    }

    try {
        const user = await prisma.user.findUnique({
            where: { userid: BigInt(targetId) }
        });

        if (!user) {
            return ctx.reply(`❌ کاربر با شناسه ${targetId} یافت نشد.`);
        }

        await prisma.user.update({
            where: { userid: BigInt(targetId) },
            data: { banned: false }
        });

        await ctx.reply(`✅ کاربر ${targetId} آن‌بن شد.`);
    } catch (error) {
        console.error('Error unbanning user:', error);
        await ctx.reply(`❌ خطایی در آن‌بن کردن کاربر رخ داد: ${error.message}`);
    }
});

export default perm;