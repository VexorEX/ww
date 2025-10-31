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

    await prisma.user.update({
        where: { userid: BigInt(targetId) },
        data: { banned: true }
    });

    await ctx.reply(`✅ کاربر ${targetId} بن شد.`);
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

    await prisma.user.update({
        where: { userid: BigInt(targetId) },
        data: { banned: false }
    });

    await ctx.reply(`✅ کاربر ${targetId} آن‌بن شد.`);
});

export default perm;