import numeral from "numeral"

export function formatNumber(num) {
    if (num == null)
        return ""

    return numeral(num).format("0.0a")
        .replace(".0", "")
}