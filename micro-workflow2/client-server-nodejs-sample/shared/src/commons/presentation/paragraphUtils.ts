export function updateParagraphLines(elem: HTMLParagraphElement, lines: string[]) {
    const newVal = lines.join('<br/>')
    if (elem.innerHTML !== newVal) {
        // TODO should it sanitize here? or allow the app to sanitize?
        elem.innerHTML =  newVal
    }
}