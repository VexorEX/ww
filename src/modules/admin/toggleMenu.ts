import config from "../../config/config.json";
import { Composer, Markup } from "telegraf";
import fs from "fs";
import path from "path";
import type { CustomContext } from "../../middlewares/userAuth";
import { InlineKeyboardButton } from "telegraf/types";

const CONFIG_PATH = path.join(__dirname, '../../config/config.json');
const toggleMenu = new Composer<CustomContext>();

// 🔁 پیمایش بازگشتی برای یافتن همه مسیرهای دارای status
function extractStatusPaths(obj: any, prefix = 'manage'): string[] {
    const paths: string[] = [];

    for (const key in obj) {
        const val = obj[key];
        const fullPath = `${prefix}.${key}`;

        if (val && typeof val === 'object') {
            if ('status' in val && typeof val.status === 'boolean') {
                paths.push(fullPath);
            }
            paths.push(...extractStatusPaths(val, fullPath));
        }
    }

    return paths;
}

// 🧩 نمایش منوی وضعیت
toggleMenu.action('admin_toggleMenu', async (ctx) => {
    ctx.session ??= {};

    const paths = extractStatusPaths(config.manage);

    const keyboard = Markup.inlineKeyboard(
        paths.map((path) => {
            const keys = path.split('.').slice(1); // remove "manage"
            const status = keys.reduce((acc, key) => acc?.[key], config.manage);
            const label = keys.join(' › ');
            return [Markup.button.callback(`${status ? '✅' : '❌'} ${label}`, `toggle_section_${keys.join('__')}`)];
        })
    );

    await ctx.reply('🧩 وضعیت نمایش دکمه‌های منو:', keyboard);
    ctx.answerCbQuery();
});

// 🧩 تغییر وضعیت
toggleMenu.action(/^toggle_section_(.+)$/, async (ctx) => {
    const sectionKey = ctx.match[1]; // e.g. "buildings__car"
    const keys = sectionKey.split('__');

    // بارگذاری نسخه تازه
    delete require.cache[require.resolve(CONFIG_PATH)];
    const freshConfig = require(CONFIG_PATH);

    // دسترسی به مسیر
    let target = freshConfig.manage;
    for (let i = 0; i < keys.length - 1; i++) {
        target = target[keys[i]];
        if (!target) return ctx.answerCbQuery('❌ مسیر نامعتبر است.');
    }

    const lastKey = keys[keys.length - 1];
    const current = target?.[lastKey]?.status;

    if (typeof current !== 'boolean') {
        return ctx.answerCbQuery('❌ بخش نامعتبر است.');
    }

    // تغییر وضعیت
    target[lastKey].status = !current;
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(freshConfig, null, 2), 'utf-8');

    // بازسازی کیبورد
    const paths = extractStatusPaths(freshConfig.manage);
    const keyboard = Markup.inlineKeyboard(
        paths.map((path) => {
            const keys = path.split('.').slice(1);
            const status = keys.reduce((acc, key) => acc?.[key], freshConfig.manage);
            const label = keys.join(' › ');
            return [Markup.button.callback(`${status ? '✅' : '❌'} ${label}`, `toggle_section_${keys.join('__')}`)];
        })
    );

    try {
        await ctx.editMessageText('🧩 وضعیت نمایش دکمه‌های منو:', {
            reply_markup: keyboard.reply_markup
        });
    } catch (err) {
        console.error('❌ خطا در ویرایش پیام:', err);
        await ctx.reply(`✅ وضعیت "${keys.join(' › ')}" به ${!current ? 'فعال' : 'غیرفعال'} تغییر یافت.`);
    }

    ctx.answerCbQuery();
});

export default toggleMenu;