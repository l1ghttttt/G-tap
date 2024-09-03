export function formatNumberShort(value: number): string {
    const suffixes = ['', 'K', 'M', 'B', 'T'];

    const tier = Math.log10(Math.abs(value)) / 3 | 0;
    if (tier === 0) return String(Math.ceil(value));

    const suffix = suffixes[tier];
    const scale = Math.pow(10, tier * 3);

    const scaledValue = Math.ceil(value / scale);
    return scaledValue.toFixed(0) + suffix;
}

export function formatNumberWithSpaces(value: number): string {
    return value.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}