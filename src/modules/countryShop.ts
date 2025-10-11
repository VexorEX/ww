    import { Composer, Markup } from 'telegraf';
    import type { CustomContext } from '../middlewares/userAuth';

    const shop = new Composer<CustomContext>();

    const shopCategories = [
        { name: '🌍 زمینی', callback: 'buy_ground' },
        { name: '🌊 دریایی', callback: 'buy_marine' },
        { name: '✈️ هوایی', callback: 'buy_aerial' },
        { name: '🛡 دفاعی', callback: 'buy_defence' },
    ];

    const shopActions = [
        { name: '🔙 بازگشت', callback: 'back_main' },
        { name: '❌ بستن', callback: 'delete' },
    ];

    function chunk<T>(arr: T[], size: number): T[][] {
        const result: T[][] = [];
        for (let i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        }
        return result;
    }

    const keyboard = Markup.inlineKeyboard([
        ...chunk(shopCategories, 2).map(pair =>
            pair.map(c => Markup.button.callback(c.name, c.callback))
        ),
        shopActions.map(a => Markup.button.callback(a.name, a.callback))
    ]);


    shop.action('shop', async (ctx) => {
        await ctx.reply('🛒 دسته‌بندی فروشگاه را انتخاب کن:', keyboard);
        ctx.answerCbQuery();
    });

    export default shop;
