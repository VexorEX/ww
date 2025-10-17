import { Context, Middleware, Markup} from 'telegraf';
import { prisma } from '../prisma';
import type { User } from '../generated/client';
import { handleUserStart } from '../modules/userPanel'; // تابع هندل start از userPanel

type SessionFlavor<T> = {
    session?: T;
};

export interface SessionData {
    hasVolunteered?: boolean;
    awaitingstateImage?: boolean;
    awaitingstateText?: boolean;
    stateImageFileId?: string;
    stateText?: string;
    laststateMessageId?: number;
    // Building-related session data
    buildingType?: string;
    buildingStep?: string;
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
    [key: string]: any;
}

export interface CustomContext extends Context, SessionFlavor<SessionData> {
    user?: User;
    state: {
        religion?: string;
        country?: string;
        countryName?: string;
        government?: string;
    };
}

const userAuth: Middleware<CustomContext> = async (ctx, next) => {
    const userId = ctx.from?.id;
    if (!userId) return await next();

    try {
        const user = await prisma.user.findUnique({ where: { userid: userId } });

        if (user) {
            ctx.user = user;

            if (!user.country) {
                await ctx.reply(
                    '🌍 شما هنوز کشوری ندارید!\nبرای شروع بازی باید داوطلب شوید و کشور دریافت کنید.',
                    Markup.inlineKeyboard([
                        Markup.button.callback('✅ داوطلب شدن', 'getCountry')
                    ])
                );
                return; // ادامه نده تا ثبت‌نام انجام بشه
            }

            // اگر پیام start بود و کشور داشت، مستقیم به userPanel برو
            if (ctx.text === '/start') {
                await handleUserStart(ctx); // هندل start از userPanel
                return;
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
