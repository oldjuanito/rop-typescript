export function updateHtmlInput(elem: HTMLInputElement | HTMLSelectElement, newVal: string) {
    if (elem.value !== newVal) {
        elem.value = newVal
    }
}