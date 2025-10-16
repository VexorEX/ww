import { Composer } from 'telegraf';
import { prisma } from '../prisma';
import type { CustomContext } from '../middlewares/userAuth';

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

export async function changeCapital(
    userid: bigint,
    operation: Operation,
    value: number
): Promise<'ok' | 'not_found' | 'invalid' | 'error'> {
    try {
        const user = await prisma.user.findUnique({ where: { userid } });
        if (!user) return 'not_found';

        let result = user.capital;

        switch (operation) {
            case 'add':
                result += BigInt(value);
                break;
            case 'subtract':
                result -= BigInt(value);
                break;
            case 'multiply':
                result *= BigInt(value);
                break;
            case 'divide':
                if (value === 0) return 'invalid';
                result /= BigInt(value);
                break;
            case 'mod':
                result %= BigInt(value);
                break;
            case 'power':
                result = BigInt(Math.pow(Number(result), value));
                break;
            case 'floor':
                result = BigInt(Math.floor(Number(result)));
                break;
            case 'ceil':
                result = BigInt(Math.ceil(Number(result)));
                break;
            case 'round':
                result = BigInt(Math.round(Number(result)));
                break;
            case 'sqrt':
                result = BigInt(Math.floor(Math.sqrt(Number(result))));
                break;
            case 'set':
                result = BigInt(value);
                break;
            default:
                return 'invalid';
        }


        await prisma.user.update({
            where: { userid },
            data: { capital: BigInt(result) }
        });

        return 'ok';
    } catch (err) {
        console.error('❌ changeCapital error:', err);
        return 'error';
    }
}

const bigintFields = ['capital', 'dailyProfit', 'crowd', 'iron', 'gold', 'oil', 'uranium']; // قابل گسترش

export async function changeUserField(
    userid: bigint,
    field: any,
    operation: Operation,
    value: number
): Promise<'ok' | 'not_found' | 'invalid' | 'error'> {
    try {
        const user = await prisma.user.findUnique({ where: { userid } });
        if (!user) return 'not_found';

        const isBigInt = bigintFields.includes(field);
        let current: number | bigint = user[field] ?? (isBigInt ? BigInt(0) : 0);


        if (current === null || current === undefined) current = isBigInt ? BigInt(0) : 0;

        let result: number | bigint;
        result = result < (isBigInt ? BigInt(0) : 0) ? (isBigInt ? BigInt(0) : 0) : result;


        if (isBigInt) {
            let val = BigInt(value);
            let cur = BigInt(current);
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
            let cur = Number(current);
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

        await prisma.user.update({
            where: { userid },
            data: { [field]: isBigInt ? BigInt(result) : Number(result) }
        });

        return 'ok';
    } catch (err) {
        console.error(`❌ changeUserField error on ${field}:`, err);
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
            let current: number | bigint = user[field] ?? (isBigInt ? BigInt(0) : 0);

            if (current === null || current === undefined) current = isBigInt ? BigInt(0) : 0;

            let result: number | bigint;
            result = result < (isBigInt ? BigInt(0) : 0) ? (isBigInt ? BigInt(0) : 0) : result;

            if (isBigInt) {
                const val = BigInt(value);
                const cur = BigInt(current);
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

            await prisma.user.update({
                where: { userid: user.userid },
                data: { [field]: isBigInt ? BigInt(result) : Number(result) }
            });

        }

        return 'ok';
    } catch (err) {
        console.error(`❌ changeFieldForAllUsers error on ${field}:`, err);
        return 'error';
    }
}


export default economy;