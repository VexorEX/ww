import { Composer, Markup } from 'telegraf';
import type { CustomContext } from '../../middlewares/userAuth';
import { prisma } from '../../prisma';
import { assetCategories , bigintFields } from '../../constants/assetCategories';

const editAsset = new Composer<CustomContext>();

//
// ✅ ویرایش دارایی با /editasset
//
editAsset.action('admin_editAsset', async (ctx) => {
    ctx.session ??= {};
    ctx.session.editStep = 'awaiting_user_id';

    await ctx.reply('📌 لطفاً شناسه کاربر را وارد کن:\nمثال: 7588477963');
    ctx.answerCbQuery();
});
editAsset.on('text', async (ctx, next) => {
    ctx.session ??= {};

    // مرحله دریافت شناسه کاربر
    if (ctx.session.editStep === 'awaiting_user_id') {
        const userIdStr = ctx.message.text;
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
        const valueStr = ctx.message.text;
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
editAsset.action(/^edit_cat_(\w+)$/, async (ctx) => {
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
editAsset.action(/^edit_item_(\w+)$/, async (ctx) => {
    ctx.session ??= {};
    ctx.session.editItem = ctx.match[1];
    ctx.session.editStep = 'awaiting_value';
    await ctx.reply('✏️ مقدار جدید را وارد کن:\n+25 برای افزایش، -25 برای کاهش، 25 برای مقدار مستقیم');
    ctx.answerCbQuery();
});
editAsset.on('text', async (ctx, next) => {
    ctx.session ??= {};

    if (ctx.session.editStep !== 'awaiting_value') return next();

    const valueStr = ctx.message.text;
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


editAsset.action('admin_editAssetAll', async (ctx) => {
    ctx.session ??= {};
    ctx.session.editStep = 'awaiting_category_all';

    const keyboard = Markup.inlineKeyboard(
        Object.entries(assetCategories).map(([key]) => [
            Markup.button.callback(`📦 ${key}`, `edit_all_cat_${key}`)
        ])
    );

    await ctx.reply('📊 دسته دارایی را برای ویرایش گروهی انتخاب کن:', keyboard);
    ctx.answerCbQuery();
});
editAsset.action(/^edit_all_cat_(\w+)$/, async (ctx) => {
    ctx.session ??= {};
    const category = ctx.match[1];
    const items = assetCategories[category];
    if (!items) return ctx.answerCbQuery('❌ دسته نامعتبر است.');

    ctx.session.editCategory = category;

    const keyboard = Markup.inlineKeyboard(
        items.map((item) => [Markup.button.callback(item, `edit_all_item_${item}`)])
    );

    try {
        await ctx.editMessageText('🔍 موردی که می‌خواهی برای همه ویرایش کنی را انتخاب کن:', keyboard);
    } catch (err) {
        console.error('❌ خطا در editMessageText:', err);
        await ctx.reply('❌ خطا در ویرایش پیام. لطفاً دوباره تلاش کن.');
    }

    ctx.answerCbQuery();
});
editAsset.action(/^edit_all_item_(\w+)$/, async (ctx) => {
    ctx.session ??= {};
    ctx.session.editItem = ctx.match[1];
    ctx.session.editStep = 'awaiting_value_all';

    await ctx.reply('✏️ مقدار جدید را وارد کن:\n+25 برای افزایش، -25 برای کاهش، 25 برای مقدار مستقیم');
    ctx.answerCbQuery();
});
editAsset.on('text', async (ctx, next) => {
    ctx.session ??= {};
    if (ctx.session.editStep !== 'awaiting_value_all') return next();

    const valueStr = ctx.message.text;
    const value = Number(valueStr);
    if (isNaN(value)) return ctx.reply('❌ مقدار عددی معتبر نیست.');

    const { editItem } = ctx.session;
    const isBigInt = bigintFields.includes(editItem);

    const users = await prisma.user.findMany({ select: { userid: true, [editItem]: true } });

    for (const user of users) {
        let current = user[editItem] ?? (isBigInt ? BigInt(0) : 0);
        let newValue: number | bigint;

        if (isBigInt) {
            const cur = BigInt(current);
            const val = BigInt(value);
            newValue = valueStr.startsWith('+') ? cur + val
                : valueStr.startsWith('-') ? cur - val
                    : val;
            if (newValue < BigInt(0)) newValue = BigInt(0);
        } else {
            const cur = Number(current);
            newValue = valueStr.startsWith('+') ? cur + value
                : valueStr.startsWith('-') ? cur - value
                    : value;
            if (newValue < 0) newValue = 0;
        }

        await prisma.user.update({
            where: { userid: user.userid },
            data: { [editItem]: isBigInt ? newValue : Number(newValue) }
        });
    }

    await ctx.reply(`✅ مقدار جدید ${editItem} برای همه کاربران اعمال شد.`);
    ctx.session.editStep = undefined;
});


export default editAsset;
