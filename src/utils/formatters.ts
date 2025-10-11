export function formatNumber(num: bigint | number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatPercent(val: number): string {
    return `${val}%`;
}