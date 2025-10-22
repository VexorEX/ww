import { Composer, Markup } from "telegraf";
import { CustomContext } from "../middlewares/userAuth";
import config from "../config/config.json";
import management from './countryManagement'
import shop from "./countryShop";
import car from "./components/car";
import market from "./countryMarket";
import state from "./countryState";
import construction from "./components/construction";
import mines from "./components/mines";

const userPanel = new Composer<CustomContext>();

const productionRow1 = config.manage?.buildings?.car?.status
    ? [Markup.button.callback('🚗 ساخت خودرو', 'build_car'), Markup.button.callback('🛒 فروش تولیدات', 'products')]
    : [];

const productionRow2 = [
    ...(config.manage?.buildings?.construction?.status
        ? [Markup.button.callback('🏗 ساخت پروژه عمرانی', 'construction')]
        : []),
    ...(config.manage?.buildings?.mines?.status
        ? [Markup.button.callback('⛏ مدیریت معادن', 'manage_mines')]
        : [])
];

const userMainKeyboard = config.manage.status
    ? Markup.inlineKeyboard([
        config.manage?.state?.status
            ? [Markup.button.callback('📜 بیانیه', 'state')]
            : [],
        [
            ...(config.manage?.management?.status
                ? [Markup.button.callback('🛠 مدیریت کشور', 'management')]
                : []),
            ...(config.manage?.shop?.status
                ? [Markup.button.callback('🛒 خرید', 'shop')]
                : [])
        ],
        [Markup.button.callback('─────────────', 'noop')],
        ...(productionRow1.length > 0 ? [productionRow1] : []),
        ...(productionRow2.length > 0 ? [productionRow2] : []),
        [
            ...(config.manage?.stock?.status
                ? [Markup.button.callback('📈 سهام', 'stock')]
                : []),
            ...(config.manage?.business?.status
                ? [Markup.button.callback('⚓ تجارت', 'business')]
                : [])
        ]
    ].filter((row) => row.length > 0))
    : Markup.inlineKeyboard([
        [Markup.button.callback('⛔ بازی متوقف شده', 'noop')]
    ]);

export async function handleUserStart(ctx: CustomContext) {
    await ctx.reply(`🎮 خوش آمدی ${ctx.from.first_name}! کشور شما: ${ctx.user?.countryName}`, userMainKeyboard);
    // await ctx.reply('> این یک بیانdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddیه رسمی است\n> صادر شده از سوی دولت ایران', {
    //     parse_mode: 'MarkdownV2'
    // });

}
userPanel.use(management);
userPanel.use(shop);
userPanel.use(state);
userPanel.use(car);
userPanel.use(market);
userPanel.use(construction);
userPanel.use(mines);

userPanel.action('back_main', async (ctx) => {
    const name = ctx.from.first_name;
    const country = ctx.user?.countryName || 'نامشخص';

    await ctx.editMessageText(`🎮 خوش آمدی ${name}! کشور شما: ${country}`, {
        reply_markup: userMainKeyboard.reply_markup
    });

    ctx.answerCbQuery();
});
userPanel.action('delete', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (err) {
        console.error('❌ خطا در حذف پیام:', err);
    }

    ctx.answerCbQuery();
});

export default userPanel;