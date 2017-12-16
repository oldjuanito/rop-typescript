const charCodeZero = '0'.charCodeAt(0)
const charCodeNine = '9'.charCodeAt(0)

function isDigitCode(n: number) {
    return (n >= charCodeZero && n <= charCodeNine)
}

export function isStrDigitsOnly(str: string) {
    for (let char of str) {
        if (!isDigitCode(char.charCodeAt(0))) {
            return false
        }
    }
    return true
}