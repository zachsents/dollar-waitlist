import numeral from "numeral"

export function formatNumber(num) {
    if (num == null)
        return ""

    return numeral(num).format("0.0a")
        .replace(".0", "")
}


export const SUBMITTED_EMAIL_LS_KEY = "submittedEmail"
export const SUCCESSFUL_EMAIL_LS_KEY = "successfulEmail"