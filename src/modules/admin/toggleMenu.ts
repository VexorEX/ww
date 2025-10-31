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
            const keys = path.split('.').slice(1);
            const sectionObj = keys.reduce((acc, key) => acc?.[key], config.manage);
            const status = typeof sectionObj?.status === 'boolean' ? sectionObj.status : null;
            const label = keys.join(' › ');
            return [Markup.button.callback(`${status === true ? '✅' : status === false ? '❌' : '❓'} ${label}`, `toggle_section_${keys.join('__')}`)];
        })
    );

    // استفاده از reply به جای editMessageText برای اولین نمایش
    await ctx.reply('🧩 وضعیت نمایش دکمه‌های منو:', keyboard);
    ctx.answerCbQuery();
});

// 🧩 تغییر وضعیت
toggleMenu.action( /^toggle_section_(.+)$/, async (ctx) => {
    const sectionKey = ctx.match[1]; // e.g. "buildings__car"
    const keys = sectionKey.split('__');

    // بارگذاری نسخه تازه
    let freshConfig;
    try {
        // استفاده از fs.readFileSync برای خواندن فایل به صورت مستقیم
        const configFile = fs.readFileSync(CONFIG_PATH, 'utf-8');
        freshConfig = JSON.parse(configFile);
    } catch (err) {
        console.error('❌ خطا در خواندن فایل پیکربندی:', err);
        return ctx.answerCbQuery('❌ خطا در خواندن فایل پیکربندی.');
    }

    // دسترسی به مسیر
    let target = freshConfig.manage;
    for (let i = 0; i < keys.length - 1; i++) {
        target = target[keys[i]];
        if (!target) return ctx.answerCbQuery('❌ مسیر نامعتبر است.');
    }

    const lastKey  = keys[keys.length - 1];
    const current = target?.[lastKey]?.status;

    if (typeof current !== 'boolean') {
        return ctx.answerCbQuery('❌ بخش نامعتبر است.');
    }

    // تغییر وضعیت
    target[lastKey].status = !current;
    
    try {
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(freshConfig, null, 2), 'utf-8');
    } catch (err) {
        console.error('❌ خطا در نوشتن فایل پیکربندی:', err);
        return ctx.answerCbQuery('❌ خطا در ذخیره تغییرات.');
    }

    // به‌روزرسانی config در حافظه
    try {
        // بارگذاری مجدد config در حافظه
        delete require.cache[require.resolve(CONFIG_PATH)];
        Object.assign(config, require(CONFIG_PATH));
    } catch (err) {
        console.error('❌ خطا در بارگذاری مجدد پیکربندی:', err);
    }

    // بازسازی کیبورد
    const paths = extractStatusPaths(freshConfig.manage);
    const keyboard = Markup.inlineKeyboard(
        paths.map((path) => {
            const keys = path.split('.').slice(1);
            const sectionObj = keys.reduce((acc, key) => acc?.[key], freshConfig.manage);
            const status = typeof sectionObj?.status === 'boolean' ? sectionObj.status : null;
            const label = keys.join(' › ');
            return [Markup.button.callback(`${status === true ? '✅' : status === false ? '❌' : '❓'} ${label}`, `toggle_section_${keys.join('__')}`)];
        })
    );

    try {
        // استفاده از editMessageText فقط اگر پیام قابل ویرایش باشد
        if (ctx.callbackQuery && ctx.callbackQuery.message) {
            await ctx.editMessageText('🧩 وضعیت نمایش دکمه‌های منو:', {
                reply_markup: keyboard.reply_markup
            });
        } else {
            // در غیر این صورت از reply استفاده کن
            await ctx.reply('🧩 وضعیت نمایش دکمه‌های منو:', keyboard);
        }
    } catch (err) {
        console.error('❌ خطا در ویرایش یا ارسال پیام:', err);
        await ctx.reply(`✅ وضعیت "${keys.join(' › ')}" به ${!current ? 'فعال' : 'غیرفعال'} تغییر یافت.`);
    }

    ctx.answerCbQuery();
});

export default toggleMenu;