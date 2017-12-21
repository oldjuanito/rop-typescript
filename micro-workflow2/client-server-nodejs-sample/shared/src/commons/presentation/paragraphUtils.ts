import { PropertyError } from '../rop/rop'

function areElementsDifferent(currElems: HTMLCollection, newElems: HTMLElement[]) {
    let missingItem = false
    for (let optIdx = 0; optIdx < newElems.length && !missingItem; optIdx++) {
        const currOpt = newElems[optIdx]
        missingItem = currElems.length > optIdx ?  currElems[optIdx].innerHTML !== currOpt.innerHTML : true
    }
    for (let optIdx = 0; optIdx < currElems.length && !missingItem; optIdx++) {
        const currOpt = currElems[optIdx]
        missingItem = newElems.length > optIdx ?  newElems[optIdx].innerHTML !== currOpt.innerHTML : true
    }
    return missingItem
}

export function updateParagraphLines(elem: HTMLDivElement, lines: string[]) {
    const newVal = lines.map(l => {
        const newElem = document.createElement('p')
        newElem.innerText = l
        return newElem
    })
    if (areElementsDifferent(elem.children , newVal)) {
        while (elem.children.length > 0) {
            elem.removeChild(elem.children[0])
        }
        for (let optIdx = 0; optIdx < newVal.length; optIdx++) {
            const currOpt = newVal[optIdx]
            elem.appendChild(currOpt)
        }
    }
}
export function updateErrorList(elem: HTMLUListElement, lines: PropertyError[]) {
    const newVal = lines.map(l => {
        const newElem = document.createElement('li')
        if (l.propName && l.propName !== '') {
            newElem.innerText = `${l.propName}: ${l.errorDescription}`
        } else {
            newElem.innerText = `${l.errorDescription}`
        }
        return newElem
    })
    if (areElementsDifferent(elem.children , newVal)) {
        while (elem.children.length > 0) {
            elem.removeChild(elem.children[0])
        }
        for (let optIdx = 0; optIdx < newVal.length; optIdx++) {
            const currOpt = newVal[optIdx]
            elem.appendChild(currOpt)
        }
    }
}