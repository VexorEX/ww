import config from "../../config/config.json";
import {Composer, Markup} from "telegraf";
import fs from "fs";
import path from "path";
import type {CustomContext} from "../../middlewares/userAuth";
const CONFIG_PATH = path.join(__dirname, '../../config/config.json');
const toggleMenu = new Composer<CustomContext>();

toggleMenu.action('admin_toggleMenu', async (ctx) => {
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
toggleMenu.action(/^toggle_section_(\w+)$/, async (ctx) => {
    const section = ctx.match[1];

    // بارگذاری نسخه تازه از فایل
    delete require.cache[require.resolve(CONFIG_PATH)];
    const freshConfig = require(CONFIG_PATH);
    const current = freshConfig.manage[section]?.status;

    if (typeof current !== 'boolean') return ctx.answerCbQuery('❌ بخش نامعتبر است.');

    // بررسی وضعیت دکمه‌ای که کاربر دیده (فقط اگر message موجود بود)
    let seenStatus: boolean | null = null;
    try {
        const buttonText = ctx.callbackQuery.data;
        const buttonLabel = ctx.callbackQuery.message?.reply_markup?.inline_keyboard
            ?.flat()
            ?.find(btn => btn.callback_data === buttonText)?.text;

        seenStatus = buttonLabel?.startsWith('✅') ? true
            : buttonLabel?.startsWith('❌') ? false
                : null;
    } catch (err) {
        console.warn('⚠️ reply_markup قابل دسترسی نیست:', err);
    }

    if (seenStatus !== null && seenStatus !== current) {
        return ctx.answerCbQuery('⚠️ وضعیت این بخش اخیراً تغییر کرده. لطفاً منو را دوباره باز کنید.');
    }

    // اعمال تغییر
    freshConfig.manage[section].status = !current;
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(freshConfig, null, 2), 'utf-8');

    // بازسازی کیبورد جدید
    const sections = Object.entries(freshConfig.manage).filter(([_, val]) =>
        typeof val === 'object' && val !== null && 'status' in val
    );

    const keyboard = Markup.inlineKeyboard(
        sections.map(([key, val]) => {
            const status = (val as { status: boolean }).status;
            return [Markup.button.callback(`${status ? '✅' : '❌'} ${key}`, `toggle_section_${key}`)];
        })
    );

    try {
        await ctx.editMessageText('🧩 وضعیت نمایش دکمه‌های منو:', {
            reply_markup: keyboard.reply_markup
        });
    } catch (err) {
        console.error('❌ خطا در ویرایش پیام:', err);
        await ctx.reply(`✅ وضعیت "${section}" به ${!current ? 'فعال' : 'غیرفعال'} تغییر یافت.`);
    }

    ctx.answerCbQuery();
});

export default toggleMenu;