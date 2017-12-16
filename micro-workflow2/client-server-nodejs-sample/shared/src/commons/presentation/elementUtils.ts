export function updateHtmlInnerText(elem: HTMLElement, newText: string) {
    if (elem.innerText !== newText) {
        elem.innerText = newText
    }
}