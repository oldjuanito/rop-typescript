import { DropDownChoice } from '../editTypes'

function areOptionsDifferent(currOpts: HTMLOptionsCollection, formOpts: DropDownChoice[]) {
    let missingItem = false
    for (let optIdx = 0; optIdx < currOpts.length && !missingItem; optIdx++) {
        const currOpt = currOpts.item(optIdx)
        missingItem = formOpts[optIdx].index !== currOpt.value
    }
    return missingItem
}

function clearHtmlOptions(currOpts: HTMLOptionsCollection) {
    while (currOpts.length > 0) {
        currOpts.remove(0)
    }
}

export function updateSelect(currOpts: HTMLOptionsCollection, formOpts: DropDownChoice[]) {
    const optsDiffer = areOptionsDifferent(currOpts, formOpts)
    if (optsDiffer) {
        clearHtmlOptions(currOpts)
        formOpts.map((logicalOpt: DropDownChoice) => {
            const newHtmlOpt = document.createElement('option')
            newHtmlOpt.value = logicalOpt.index
            newHtmlOpt.label = logicalOpt.label
            currOpts.add(newHtmlOpt)
        })
    }
}