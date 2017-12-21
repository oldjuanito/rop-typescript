"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function areElementsDifferent(currElems, newElems) {
    var missingItem = false;
    for (var optIdx = 0; optIdx < newElems.length && !missingItem; optIdx++) {
        var currOpt = newElems[optIdx];
        missingItem = currElems.length > optIdx ? currElems[optIdx].innerHTML !== currOpt.innerHTML : true;
    }
    for (var optIdx = 0; optIdx < currElems.length && !missingItem; optIdx++) {
        var currOpt = currElems[optIdx];
        missingItem = newElems.length > optIdx ? newElems[optIdx].innerHTML !== currOpt.innerHTML : true;
    }
    return missingItem;
}
function updateParagraphLines(elem, lines) {
    var newVal = lines.map(function (l) {
        var newElem = document.createElement('p');
        newElem.innerText = l;
        return newElem;
    });
    if (areElementsDifferent(elem.children, newVal)) {
        while (elem.children.length > 0) {
            elem.removeChild(elem.children[0]);
        }
        for (var optIdx = 0; optIdx < newVal.length; optIdx++) {
            var currOpt = newVal[optIdx];
            elem.appendChild(currOpt);
        }
    }
}
exports.updateParagraphLines = updateParagraphLines;
function updateErrorList(elem, lines) {
    var newVal = lines.map(function (l) {
        var newElem = document.createElement('li');
        if (l.propName && l.propName !== '') {
            newElem.innerText = l.propName + ": " + l.errorDescription;
        }
        else {
            newElem.innerText = "" + l.errorDescription;
        }
        return newElem;
    });
    if (areElementsDifferent(elem.children, newVal)) {
        while (elem.children.length > 0) {
            elem.removeChild(elem.children[0]);
        }
        for (var optIdx = 0; optIdx < newVal.length; optIdx++) {
            var currOpt = newVal[optIdx];
            elem.appendChild(currOpt);
        }
    }
}
exports.updateErrorList = updateErrorList;
