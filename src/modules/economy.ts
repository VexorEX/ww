import { prisma } from '../prisma';
import { bigintFields } from '../constants/assetCategories';
import {Composer} from "telegraf";
import type {CustomContext} from "../middlewares/userAuth";

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
    value: number | bigint,
    isBigInt: boolean
): T | 'invalid' {
    try {
        let result: unknown;

        if (isBigInt) {
            // Ensure both operands are bigint before operations to avoid mixing errors
            const cur = typeof current === 'bigint' ? current : BigInt(current as any);
            const val = typeof value === 'bigint' ? value : BigInt(value as any);

            switch (operation) {
                case 'add': result = cur + (val as bigint); break;
                case 'subtract': result = cur - (val as bigint); break;
                case 'multiply': result = cur * (val as bigint); break;
                case 'divide':
                    if ((val as bigint) === 0n) return 'invalid';
                    result = cur / (val as bigint);
                    break;
                case 'mod': result = cur % (val as bigint); break;
                case 'power': {
                    // exponentiation on bigints: convert exponent to number (may overflow for large exp)
                    const exp = typeof value === 'bigint' ? Number(value) : Number(value);
                    result = BigInt(Math.pow(Number(cur), exp));
                    break;
                }
                case 'floor': result = BigInt(Math.floor(Number(cur))); break;
                case 'ceil': result = BigInt(Math.ceil(Number(cur))); break;
                case 'round': result = BigInt(Math.round(Number(cur))); break;
                case 'sqrt': result = BigInt(Math.floor(Math.sqrt(Number(cur)))); break;
                case 'set': result = val; break;
                default: return 'invalid';
            }
        } else {
            const cur = Number(current);
            const val = typeof value === 'bigint' ? Number(value) : Number(value);

            switch (operation) {
                case 'add': result = cur + val; break;
                case 'subtract': result = cur - val; break;
                case 'multiply': result = cur * val; break;
                case 'divide':
                    if (val === 0) return 'invalid';
                    result = cur / val;
                    break;
                case 'mod': result = cur % val; break;
                case 'power': result = Math.pow(cur, val); break;
                case 'floor': result = Math.floor(cur); break;
                case 'ceil': result = Math.ceil(cur); break;
                case 'round': result = Math.round(cur); break;
                case 'sqrt': result = Math.floor(Math.sqrt(cur)); break;
                case 'set': result = val; break;
                default: return 'invalid';
            }
        }

        return result as T;
    } catch (err) {
        console.error('❌ applyOperation error:', err);
        return 'invalid';
    }
}

export async function changeUserField(
    userid: bigint,
    field: string,
    operation: Operation,
    value: number | bigint
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
            data: {
                [field]: bigintFields.includes(field) ? final : Number(final)
            }
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
    value: number | bigint
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
                data: {
                    [field]: bigintFields.includes(field) ? final : Number(final)
        }
            });
        }

        return 'ok';
    } catch (err) {
        console.error(`❌ changeFieldForAllUsers error on "${field}":`, err);
        return 'error';
    }
}

export async function changeCapital(
    userid: bigint,
    operation: Operation,
    value: number | bigint
): Promise<'ok' | 'not_found' | 'invalid' | 'error'> {
    return changeUserField(userid, 'capital', operation, value);
}

export default economy;
