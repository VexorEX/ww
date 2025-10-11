"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeCapital = changeCapital;
const telegraf_1 = require("telegraf");
const prisma_1 = require("../prisma");
const economy = new telegraf_1.Composer();
async function changeCapital(userid, operation, value) {
    try {
        const user = await prisma_1.prisma.user.findUnique({ where: { userid } });
        if (!user)
            return 'not_found';
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
                if (value === 0)
                    return 'invalid';
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
        await prisma_1.prisma.user.update({
            where: { userid },
            data: { capital: BigInt(result) }
        });
        return 'ok';
    }
    catch (err) {
        console.error('❌ changeCapital error:', err);
        return 'error';
    }
}
exports.default = economy;
