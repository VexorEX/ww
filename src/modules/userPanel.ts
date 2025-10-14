import { Composer, Markup } from "telegraf";
import { CustomContext } from "../middlewares/userAuth";
import config from "../config/config.json";
import management from './countryManagement'
import shop from "./countryShop";
import { escapeMarkdownV2 } from "../utils/escape";
import building from "./countryBuilding";
import state from "./countryState";

const userPanel = new Composer<CustomContext>();

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
        config.manage?.buildings?.status
            ? [Markup.button.callback('🏗 ساخت و ساز', 'building')]
            : [],
        [
            ...(config.manage?.stock?.status
                ? [Markup.button.callback('📈 سهام', 'stock')]
                : []),
            ...(config.manage?.business?.status
                ? [Markup.button.callback('⚓ تجارت', 'business')]
                : [])
        ]
    ].filter((row) => row.length > 0))
    : Markup.inlineKeyboard([[Markup.button.callback('⛔ بازی متوقف شده', 'noop')]]);

const adminPanelKeyboard = Markup.inlineKeyboard([
    [Markup.button.callback('✏️ ویرایش دارایی', 'admin_editAssets'), Markup.button.callback('🌪 بلای طبیعی', 'admin_disaster')],
    [Markup.button.callback('🌐 سازمان ملل', 'admin_un')],
    [Markup.button.callback('📰 روزنامه', 'admin_news'), Markup.button.callback('📢 اعلان‌ها', 'admin_announcements')],
    [Markup.button.callback('📊 آمار جهانی', 'admin_globalStats'), Markup.button.callback('⛏ آمار منابع', 'admin_resourceStats'), Markup.button.callback('📋 آمار عمومی', 'admin_publicStats')],
    [Markup.button.callback('📣 پیام همگانی', 'admin_broadcast')],
    [Markup.button.callback('─────────────', 'noop')],
    [Markup.button.callback('🔙 بازگشت', 'admin_back'), Markup.button.callback('❌ بستن', 'admin_close')],
]);


export async function handleUserStart(ctx: CustomContext) {
    await ctx.reply(`🎮 خوش آمدی ${ctx.from.first_name}! کشور شما: ${ctx.user?.countryName}`, userMainKeyboard);
    // await ctx.reply('> این یک بیانdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddیه رسمی است\n> صادر شده از سوی دولت ایران', {
    //     parse_mode: 'MarkdownV2'
    // });

}
userPanel.use(management);
userPanel.use(shop);
userPanel.use(state);  // state قبل از building
userPanel.use(building);

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
