/**
 * Converts a number into shorter version (1,000 - 1k)
 */
export default function abbreviateNumber(value) {
    if (value < 1000) return value;

    let exponent = Math.floor(Math.floor(Math.log10(value))/3);
    let power = Math.pow(1000, exponent);
    let suffixes = ['', 'k', 'm', 'b', 't'];
    let result = value/power;
    if (result % 1) result = result.toFixed(1);
    return result + suffixes[exponent];
}