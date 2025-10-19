import { Composer } from 'telegraf';
import { prisma } from '../prisma';
import type { CustomContext } from '../middlewares/userAuth';
import { bigintFields } from '../constants/assetCategories';

const economy = new Composer<CustomContext>();

export type Operation =
    | 'add'
    | 'subtract'
    | 'multiply'
    | 'divide'
    | 'mod'
    | 'power'
    | 'floor'
    | 'ceil'
    | 'round'
    | 'sqrt'
    | 'set';

function applyOperation<T extends number | bigint>(
    current: T,
    operation: Operation,
    value: number,
    isBigInt: boolean
): T | 'invalid' {
    try {
        let result: unknown;

        if (isBigInt) {
            const cur = BigInt(current);
            const val = BigInt(value);
            switch (operation) {
                case 'add': result = cur + val; break;
                case 'subtract': result = cur - val; break;
                case 'multiply': result = cur * val; break;
                case 'divide': if (value === 0) return 'invalid'; result = cur / val; break;
                case 'mod': result = cur % val; break;
                case 'power': result = BigInt(Math.pow(Number(cur), value)); break;
                case 'floor': result = BigInt(Math.floor(Number(cur))); break;
                case 'ceil': result = BigInt(Math.ceil(Number(cur))); break;
                case 'round': result = BigInt(Math.round(Number(cur))); break;
                case 'sqrt': result = BigInt(Math.floor(Math.sqrt(Number(cur)))); break;
                case 'set': result = val; break;
                default: return 'invalid';
            }
        } else {
            const cur = Number(current);
            switch (operation) {
                case 'add': result = cur + value; break;
                case 'subtract': result = cur - value; break;
                case 'multiply': result = cur * value; break;
                case 'divide': if (value === 0) return 'invalid'; result = cur / value; break;
                case 'mod': result = cur % value; break;
                case 'power': result = Math.pow(cur, value); break;
                case 'floor': result = Math.floor(cur); break;
                case 'ceil': result = Math.ceil(cur); break;
                case 'round': result = Math.round(cur); break;
                case 'sqrt': result = Math.floor(Math.sqrt(cur)); break;
                case 'set': result = value; break;
                default: return 'invalid';
            }
        }

        return result as T;
    } catch (err) {
        console.error('❌ applyOperation error:', err);
        return 'invalid';
    }
}

export async function changeCapital(
    userid: bigint,
    operation: Operation,
    value: number
): Promise<'ok' | 'not_found' | 'invalid' | 'error'> {
    try {
        const user = await prisma.user.findUnique({ where: { userid } });
        if (!user) return 'not_found';

        const result = applyOperation(user.capital, operation, value, true);
        if (result === 'invalid') return 'invalid';

        const final = result < BigInt(0) ? BigInt(0) : result;

        await prisma.user.update({
            where: { userid },
            data: { capital: final }
        });

        return 'ok';
    } catch (err) {
        console.error(`❌ changeCapital error for user ${userid}:`, err);
        return 'error';
    }
}

export async function changeUserField(
    userid: bigint,
    field: string,
    operation: Operation,
    value: number
): Promise<'ok' | 'not_found' | 'invalid' | 'error'> {
    try {
        const user = await prisma.user.findUnique({ where: { userid } });
        if (!user) return 'not_found';

        if (!(field in user)) {
            console.warn(`❌ فیلد "${field}" در مدل User وجود ندارد.`);
            return 'invalid';
        }

        const isBigInt = bigintFields.includes(field);
        const current = user[field] ?? (isBigInt ? BigInt(0) : 0);
        const result = applyOperation(current, operation, value, isBigInt);
        if (result === 'invalid') return 'invalid';

        const final = isBigInt
            ? result < BigInt(0) ? BigInt(0) : result
            : result < 0 ? 0 : result;

        await prisma.user.update({
            where: { userid },
            data: { [field]: isBigInt ? BigInt(final) : Number(final) }
        });

        return 'ok';
    } catch (err) {
        console.error(`❌ changeUserField error on "${field}" for user ${userid}:`, err);
        return 'error';
    }
}

export async function changeFieldForAllUsers(
    field: string,
    operation: Operation,
    value: number
): Promise<'ok' | 'invalid' | 'error'> {
    try {
        const users = await prisma.user.findMany({ select: { userid: true, [field]: true } });
        const isBigInt = bigintFields.includes(field);

        for (const user of users) {
            if (!(field in user)) {
                console.warn(`❌ فیلد "${field}" در مدل User وجود ندارد.`);
                return 'invalid';
            }

            const current = user[field] ?? (isBigInt ? BigInt(0) : 0);
            const result = applyOperation(current, operation, value, isBigInt);
            if (result === 'invalid') return 'invalid';

            const final = isBigInt
                ? result < BigInt(0) ? BigInt(0) : result
                : result < 0 ? 0 : result;

            await prisma.user.update({
                where: { userid: user.userid },
                data: { [field]: isBigInt ? BigInt(final) : Number(final) }
            });
        }

        return 'ok';
    } catch (err) {
        console.error(`❌ changeFieldForAllUsers error on "${field}":`, err);
        return 'error';
    }
}

export default economy;
