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

export default toggleMenu;