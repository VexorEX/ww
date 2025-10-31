import { Context, Middleware, Markup} from 'telegraf';
import { prisma } from '../prisma';
import type { User } from '../generated/client';
import { handleUserStart } from '../modules/userPanel'; // تابع هندل start از userPanel

type SessionFlavor<T> = {
    session?: T;
};

export interface SessionData {
    lotteryStep?: string;
    pendingTicketCount?: number;
    hasVolunteered?: boolean;
    awaitingstateImage?: boolean;
    awaitingstateText?: boolean;
    stateImageFileId?: string;
    stateText?: string;
    laststateMessageId?: number;
    // Building-related session data
    awaiting_image_project?: boolean;
    buildingType?: string;
    buildingStep?: string;
    buildingName?: string;
    carName?: string;
    carImage?: string;
    carImageFileId?: string;
    setupCost?: number;
    requestUserId?: bigint;
    pendingUserId?: bigint;
    pendingCountry?: any;
    awaiting_user_id?: boolean;
    awaiting_value?: boolean;
    awaiting_value_all?: boolean;
    awaiting_ticket_count?: any;
    [key: string]: any;
}

export interface CustomContext extends Context, SessionFlavor<SessionData> {
    user?: User;
    state: { religion?: string; country?: string; countryName?: string; government?: string; };
}

const userAuth: Middleware<CustomContext> = async (ctx, next) => {
    const userIdNum = ctx.from?.id;
    if (!userIdNum) return await next();

    try {
        // اگر schema از BigInt استفاده می‌کند، بهتر است مقدار را به BigInt تبدیل کنیم
        const user = await prisma.user.findUnique({ where: { userid: BigInt(userIdNum) } });

        if (user) {
            ctx.user = user;

            if (user.banned) {
                return ctx.reply('⛔ شما توسط مدیریت بن شده‌اید و نمی‌توانید از ربات استفاده کنید.');
            }


            if (!user.country) {
                // اگر این یک callback_query است و داده‌اش قرار است توسط registration هندل شود،
                // اجازه بده به next بره تا actionها دریافت شوند.
                const isCallback = ctx.updateType === 'callback_query';
                const callbackData = (ctx.callbackQuery as any)?.data as string | undefined;

                // لیست الگوهایی که مربوط به فرایند ثبت‌نام/دریافت کشور هستند
                const allowedPrefixes = [
                    'getCountry',
                    'request_country',
                    'rank0_', 'rank1_', 'rank2_', 'rank3_',
                    'setCountry_', 'confirm_country', 'reject_', 'reselect_country_'
                ];

                const allowedForCallback = isCallback && typeof callbackData === 'string' &&
                    allowedPrefixes.some(pref => callbackData.startsWith(pref));

                if (allowedForCallback) {
                    return await next();
                }

                // برای پیام‌های عادی یا callbackهای غیرمجاز، پیغام راهنمایی نشان بده
                await ctx.reply(
                    '🌍 شما هنوز کشوری ندارید!\nبرای شروع بازی باید داوطلب شوید و کشور دریافت کنید.',
                    Markup.inlineKeyboard([ Markup.button.callback('✅ داوطلب شدن', 'getCountry') ])
                );
                return; // از عبور بیشتر جلوگیری کن
            }

            // اگر پیامِ متنی /start بود و کاربر کشور دارد، مستقیم به userPanel برو
            if (ctx.updateType === 'message') {
                const text = (ctx.message as any)?.text as string | undefined;
                if (text === '/start' || text?.startsWith('/start lottery')) {
                    await handleUserStart(ctx);
                    return;
                }
            }
        } else {
            ctx.user = undefined;
        }
    } catch (error) {
        console.error('❌ خطا در بررسی کاربر:', error);
        ctx.user = undefined;
    }

    await next();
};

export default userAuth;
