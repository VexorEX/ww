import { Composer, Markup } from 'telegraf';
import type { CustomContext } from '../../middlewares/userAuth';
import { prisma } from '../../prisma';
import config from '../../config/config.json';
import fs from 'fs';
import path from 'path';
import { assetCategories , bigintFields } from '../../constants/assetCategories';

const adminPanel = new Composer<CustomContext>();
const CONFIG_PATH = path.join(__dirname, '../../config/config.json');
const REWARD_LOG_PATH = path.join(__dirname, '../../config/dailyRewardLog.json');
const ADMIN_IDS: number[] = config.manage.country.admins || [];

//
// ✅ پنل اصلی با /panel
//
adminPanel.command('panel', async (ctx) => {
    if (!ADMIN_IDS.includes(ctx.from.id)) return ctx.reply('⛔ شما ادمین نیستید.');

    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('🛠 ویرایش دارایی', 'admin_edit_asset')],
        [Markup.button.callback('🧩 مدیریت منو', 'admin_toggle_menu')],
        [Markup.button.callback('🎁 ارسال جایزه روزانه', 'admin_daily_reward')],
        [Markup.button.callback('❌ بستن', 'delete')]
    ]);

    await ctx.reply('🎛 پنل مدیریت:', keyboard);
});

adminPanel.action('admin_toggle_menu', async (ctx) => {
    ctx.session ??= {};

    const sections = Object.entries(config.manage).filter(([_, val]) =>
        typeof val === 'object' && val !== null && 'status' in val
    );

    const keyboard = Markup.inlineKeyboard(
        sections.map(([key, val]) => {
            const status = (val as { status: boolean }).status;
            return [Markup.button.callback(`${status ? '✅' : '❌'} ${key}`, `toggle_section_${key}`)];
        })
    );


    await ctx.reply('🧩 وضعیت نمایش دکمه‌های منو:', keyboard);
    ctx.answerCbQuery();
});
adminPanel.action(/^toggle_section_(\w+)$/, async (ctx) => {
    const section = ctx.match[1];
    const current = config.manage[section]?.status;

    if (typeof current !== 'boolean') return ctx.answerCbQuery('❌ بخش نامعتبر است.');
    config.manage[section].status = !current;
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');

    try {
        await ctx.editMessageText(`✅ وضعیت "${section}" به ${!current ? 'فعال' : 'غیرفعال'} تغییر یافت.`);
    } catch (err) {
        console.error('❌ خطا در ویرایش پیام:', err);
        await ctx.reply(`✅ وضعیت "${section}" به ${!current ? 'فعال' : 'غیرفعال'} تغییر یافت.`);
    }

    ctx.answerCbQuery();
});

adminPanel.action('admin_daily_reward', async (ctx) => {
    ctx.session ??= {};
    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('🎁 ارسال جایزه روزانه', 'send_daily_reward')]
    ]);
    await ctx.reply('🎯 فقط یک‌بار در روز قابل اجراست:', keyboard);
    ctx.answerCbQuery();
});

adminPanel.action('send_daily_reward', async (ctx) => {
    if (!ADMIN_IDS.includes(ctx.from.id)) return ctx.answerCbQuery('⛔ دسترسی ندارید.');

    const today = new Date().toISOString().split('T')[0];
    let lastSent = '';

    try {
        const log = JSON.parse(fs.readFileSync(REWARD_LOG_PATH, 'utf-8'));
        lastSent = log.lastSent || '';
    } catch {
        lastSent = '';
    }

    if (lastSent === today) return ctx.answerCbQuery('⛔ جایزه امروز قبلاً ارسال شده.');

    const users = await prisma.user.findMany();
    let count = 0;

    for (const user of users) {
        const profit = BigInt(user.dailyProfit || 0);
        const current = BigInt(user.capital || 0);
        await prisma.user.update({
            where: { userid: user.userid },
            data: { capital: current + profit }
        });
        count++;
    }

    fs.writeFileSync(REWARD_LOG_PATH, JSON.stringify({ lastSent: today }, null, 2), 'utf-8');
    await ctx.reply(`✅ جایزه روزانه برای ${count} کاربر ارسال شد.`);
    ctx.answerCbQuery('🎁 ارسال شد!');
});

//
// ✅ ویرایش دارایی با /editasset
//
adminPanel.action('admin_edit_asset', async (ctx) => {
    ctx.session ??= {};
    ctx.session.editStep = 'awaiting_user_id';

    await ctx.reply('📌 لطفاً شناسه کاربر را وارد کن:\nمثال: 7588477963');
    ctx.answerCbQuery();
});

adminPanel.on('text', async (ctx, next) => {
    ctx.session ??= {};

    // مرحله دریافت شناسه کاربر
    if (ctx.session.editStep === 'awaiting_user_id') {
        const userIdStr = ctx.message.text.trim();
        if (!/^\d+$/.test(userIdStr)) return ctx.reply('❌ شناسه معتبر نیست.');

        ctx.session.editUserId = BigInt(userIdStr);
        ctx.session.editStep = 'awaiting_category';

        const keyboard = Markup.inlineKeyboard(
            Object.entries(assetCategories).map(([key]) => [
                Markup.button.callback(`📦 ${key}`, `edit_cat_${key}`)
            ])
        );

        await ctx.reply('🔧 دسته دارایی را انتخاب کن:', keyboard);
        return;
    }

    // مرحله دریافت مقدار
    if (ctx.session.editStep === 'awaiting_value') {
        const valueStr = ctx.message.text.trim();
        const value = Number(valueStr);
        if (isNaN(value)) return ctx.reply('❌ مقدار عددی معتبر نیست.');

        const { editUserId, editItem } = ctx.session;
        const user = await prisma.user.findUnique({ where: { userid: editUserId } });
        if (!user) return ctx.reply('❌ کاربر یافت نشد.');

        const isBigInt = bigintFields.includes(editItem);
        let newValue: number | bigint;

        if (isBigInt) {
            const current = BigInt(user[editItem] || 0);
            newValue = valueStr.startsWith('+') ? current + BigInt(value)
                : valueStr.startsWith('-') ? current - BigInt(Math.abs(value))
                    : BigInt(value);
        } else {
            const current = Number(user[editItem] || 0);
            newValue = valueStr.startsWith('+') ? current + value
                : valueStr.startsWith('-') ? current - Math.abs(value)
                    : value;
        }

        await prisma.user.update({
            where: { userid: editUserId },
            data: { [editItem]: isBigInt ? newValue : Number(newValue) }
        });

        await ctx.reply(`✅ مقدار جدید ${editItem} برای کاربر ${editUserId} تنظیم شد: ${newValue.toLocaleString()}`);
        ctx.session.editStep = undefined;
        return;
    }

    return next();
});

adminPanel.action(/^edit_cat_(\w+)$/, async (ctx) => {
    ctx.session ??= {};
    const category = ctx.match[1];
    const items = assetCategories[category];
    if (!items) return ctx.answerCbQuery('❌ دسته نامعتبر است.');

    ctx.session.editCategory = category;

    const keyboard = Markup.inlineKeyboard(
        items.map((item) => [Markup.button.callback(item, `edit_item_${item}`)])
    );

    try {
        await ctx.editMessageText('🔍 موردی که می‌خواهی ویرایش کنی را انتخاب کن:', keyboard);
    } catch (err) {
        console.error('❌ خطا در editMessageText:', err);
        await ctx.reply('❌ خطا در ویرایش پیام. لطفاً دوباره تلاش کن.');
    }

    ctx.answerCbQuery();
});

adminPanel.action(/^edit_item_(\w+)$/, async (ctx) => {
    ctx.session ??= {};
    ctx.session.editItem = ctx.match[1];
    ctx.session.editStep = 'awaiting_value';
    await ctx.reply('✏️ مقدار جدید را وارد کن:\n+25 برای افزایش، -25 برای کاهش، 25 برای مقدار مستقیم');
    ctx.answerCbQuery();
});
adminPanel.on('text', async (ctx, next) => {
    ctx.session ??= {};

    if (ctx.session.editStep !== 'awaiting_value') return next();

    const valueStr = ctx.message.text.trim();
    const value = Number(valueStr);
    if (isNaN(value)) return ctx.reply('❌ مقدار عددی معتبر نیست.');

    const { editUserId, editItem } = ctx.session;
    if (!editUserId || !editItem) return ctx.reply('❌ اطلاعات ناقص است.');

    const user = await prisma.user.findUnique({ where: { userid: editUserId } });
    if (!user) return ctx.reply('❌ کاربر یافت نشد.');

    const isBigInt = bigintFields.includes(editItem);
    let newValue: number | bigint;

    if (isBigInt) {
        const current = BigInt(user[editItem] || 0);
        newValue = valueStr.startsWith('+') ? current + BigInt(value)
            : valueStr.startsWith('-') ? current - BigInt(Math.abs(value))
                : BigInt(value);
    } else {
        const current = Number(user[editItem] || 0);
        newValue = valueStr.startsWith('+') ? current + value
            : valueStr.startsWith('-') ? current - Math.abs(value)
                : value;
    }

    await prisma.user.update({
        where: { userid: editUserId },
        data: { [editItem]: isBigInt ? newValue : Number(newValue) }
    });

    await ctx.reply(`✅ مقدار جدید ${editItem} برای کاربر ${editUserId} تنظیم شد: ${newValue.toLocaleString()}`);
    ctx.session.editStep = undefined;
});


export default adminPanel;
