import { Composer, Markup } from 'telegraf';
import type { CustomContext } from '../../middlewares/userAuth';
import { prisma } from '../../prisma';
import { assetCategories , bigintFields } from '../../constants/assetCategories';
import { calculateNewValue } from "../helper/calculate";
import {changeFieldForAllUsers, changeUserField ,Operation } from "../economy";

const editAsset = new Composer<CustomContext>();

const cancelBtn = Markup.inlineKeyboard([
    [Markup.button.callback('❌ لغو', 'cancel_edit')]
])


editAsset.on('text', async (ctx, next) => {
    ctx.session ??= {};
    if (!ctx.session || !ctx.session.editStep) {
        return next();
    }
    const valueStr = ctx.message.text;
    // مرحله دریافت شناسه کاربر
    if (ctx.session.editStep === 'awaiting_user_id') {
        if (!/^\d+$/.test(valueStr)) return ctx.reply('❌ شناسه معتبر نیست.');
        ctx.session.editUserId = BigInt(valueStr);
        ctx.session.editStep = 'awaiting_category';

        const keyboard = Markup.inlineKeyboard([
            ...Object.entries(assetCategories).map(([key]) => [
                Markup.button.callback(`📦 ${key}`, `edit_cat_${key}`)
            ]),
            [Markup.button.callback('❌ لغو', 'cancel_edit')]
        ]);

        await ctx.reply('🔧 دسته دارایی را انتخاب کن:', keyboard);
        return;
    }

    // مرحله دریافت مقدار برای یک کاربر
    if (ctx.session.editStep === 'awaiting_value') {
        const valueStr = ctx.message.text?.trim();
        const value = Number(valueStr?.replace(/[+-]/, ''));
        if (isNaN(value)) return ctx.reply('❌ مقدار عددی معتبر نیست.');

        const { editUserId, editItem } = ctx.session;
        if (!editUserId || !editItem) return ctx.reply('❌ اطلاعات ناقص است.');

        const operation: Operation =
            valueStr.startsWith('+') ? 'add'
                : valueStr.startsWith('-') ? 'subtract'
                    : 'set';

        const result = await changeUserField(editUserId, editItem, operation, value);

        if (result === 'ok') {
            await ctx.reply(`✅ مقدار جدید ${editItem} برای کاربر ${editUserId} اعمال شد.`);
        } else if (result === 'not_found') {
            await ctx.reply('❌ کاربر یافت نشد.');
        } else if (result === 'invalid') {
            await ctx.reply('❌ عملیات نامعتبر بود.');
        } else {
            await ctx.reply('❌ خطا در ویرایش. لطفاً دوباره تلاش کن.');

        }

        ctx.session.editStep = undefined;
        return;
    }

    // مرحله دریافت مقدار برای همه کاربران
    if (ctx.session.editStep === 'awaiting_value_all') {
        const valueStr = ctx.message.text?.trim();
        const value = Number(valueStr?.replace(/[+-]/, ''));
        if (isNaN(value)) return ctx.reply('❌ مقدار عددی معتبر نیست.');

        const { editItem } = ctx.session;
        const operation: Operation =
            valueStr.startsWith('+') ? 'add'
                : valueStr.startsWith('-') ? 'subtract'
                    : 'set';

        const result = await changeFieldForAllUsers(editItem, operation, value);

        if (result === 'ok') {
            await ctx.reply(`✅ مقدار جدید ${editItem} برای همه کاربران اعمال شد.`);
        } else if (result === 'invalid') {
            await ctx.reply('❌ عملیات نامعتبر بود.');
        } else {
            await ctx.reply('❌ خطا در ویرایش گروهی. لطفاً دوباره تلاش کن.');
        }

        ctx.session.editStep = undefined;
        return;
    }

});

//
// ✅ ویرایش دارایی با /editasset
//
editAsset.action('admin_editAsset', async (ctx) => {
    ctx.session ??= {};
    ctx.session.editStep = 'awaiting_user_id';

    await ctx.reply('📌 لطفاً شناسه کاربر را وارد کن:\nمثال: 7588477963');
    ctx.answerCbQuery();
});
editAsset.action(/^edit_cat_(\w+)$/, async (ctx) => {
    ctx.session ??= {};
    const category = ctx.match[1];
    const items = assetCategories[category];
    if (!items) return ctx.answerCbQuery('❌ دسته نامعتبر است.');

    ctx.session.editCategory = category;

    const keyboard = Markup.inlineKeyboard([
        ...items.map((item) => [Markup.button.callback(item, `edit_item_${item}`)]),
        [Markup.button.callback('❌ لغو', 'cancel_edit')]
    ]);


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
    await ctx.reply('✏️ مقدار جدید را وارد کن:\n+25 برای افزایش، -25 برای کاهش، 25 برای مقدار مستقیم', cancelBtn);
    ctx.answerCbQuery();
});


editAsset.action('admin_editAssetAll', async (ctx) => {
    ctx.session ??= {};
    ctx.session.editStep = 'awaiting_category_all';

    const keyboard = Markup.inlineKeyboard([
        ...Object.entries(assetCategories).map(([key]) => [
            Markup.button.callback(`📦 ${key}`, `edit_all_cat_${key}`)
        ]),
        [Markup.button.callback('❌ لغو', 'cancel_edit')]
    ]);


    await ctx.reply('📊 دسته دارایی را برای ویرایش گروهی انتخاب کن:', keyboard);
    ctx.answerCbQuery();
});
editAsset.action(/^edit_all_cat_(\w+)$/, async (ctx) => {
    ctx.session ??= {};
    const category = ctx.match[1];
    const items = assetCategories[category];
    if (!items) return ctx.answerCbQuery('❌ دسته نامعتبر است.');

    ctx.session.editCategory = category;

    const keyboard = Markup.inlineKeyboard([
        ...items.map((item) => [Markup.button.callback(item, `edit_all_item_${item}`)]),
        [Markup.button.callback('❌ لغو', 'cancel_edit')]
    ]);


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

    await ctx.reply('✏️ مقدار جدید را وارد کن:\n+25 برای افزایش، -25 برای کاهش، 25 برای مقدار مستقیم',cancelBtn);
    ctx.answerCbQuery();
});

editAsset.action('cancel_edit', async (ctx) => {
    ctx.session.editStep = undefined;
    await ctx.editMessageText('❌ عملیات ویرایش لغو شد.',{});
    ctx.answerCbQuery();
});


export default editAsset;
