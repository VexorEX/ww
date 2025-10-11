import { prisma } from "../../prisma";
import {Composer} from "telegraf";
import type {CustomContext} from "../../middlewares/userAuth";
import config from '../../config/config.json';
import { escapeMarkdownV2 } from "../../utils/escape";


const admin = new Composer<CustomContext>();


admin.action(/admin_approve_building_(\d+)/, async (ctx) => {
    const userId = BigInt(ctx.match[1]);

    const user = await prisma.user.findUnique({ where: { userid: userId } });
    if (!user || user.capital < 250_000_000) {
        return ctx.reply('❌ بودجه کافی ندارد.');
    }

    await prisma.user.update({
        where: { userid: userId },
        data: { capital: { decrement: 250_000_000 } }
    });

    await prisma.productionLine.create({
        data: {
            ownerId: userId,
            country: user.country,
            name: ctx.session?.carName,
            type: 'car',
            imageUrl: ctx.session?.carImage,
            dailyLimit: 15,
            setupCost: BigInt(250_000_000)
        }
    });

    await ctx.telegram.sendPhoto(config.channels.updates, ctx.session.carImage, {
        caption: escapeMarkdownV2(
            `🏭 خط تولید جدید راه‌اندازی شد\n\n` +
            `> کشور سازنده: *${user.countryName}*\n` +
            `> محصول: *${ctx.session.carName}*\n\n` +
            `بودجه راه‌اندازی: 250M\nظرفیت تولید روزانه: 15 خودرو`
        ),
        parse_mode: 'MarkdownV2'
    });

    await ctx.reply('✅ خط تولید ثبت شد و به کانال ارسال شد.');
});