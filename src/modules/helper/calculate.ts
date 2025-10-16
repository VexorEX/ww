export function calculateNewValue(
    current: number | bigint,
    valueStr: string,
    isBigInt: boolean
): number | bigint {
    if (isBigInt) {
        const value = BigInt(valueStr.replace(/[+-]/, ''));
        let result = valueStr.startsWith('+') ? (current as bigint) + value
            : valueStr.startsWith('-') ? (current as bigint) - value
                : BigInt(valueStr);

        return result < BigInt(0) ? BigInt(0) : result;
    } else {
        const value = Number(valueStr.replace(/[+-]/, ''));
        let result = valueStr.startsWith('+') ? (current as number) + value
            : valueStr.startsWith('-') ? (current as number) - value
                : Number(valueStr);

        return result < 0 ? 0 : result;
    }
}
