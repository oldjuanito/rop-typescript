"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function areOptionsDifferent(currOpts, formOpts) {
    var missingItem = false;
    for (var optIdx = 0; optIdx < currOpts.length && !missingItem; optIdx++) {
        var currOpt = currOpts.item(optIdx);
        if (formOpts[optIdx]) {
            missingItem = formOpts[optIdx].index !== currOpt.value;
        }
        else {
            missingItem = true;
        }
    }
    for (var optIdx = 0; optIdx < formOpts.length && !missingItem; optIdx++) {
        if (currOpts.length > optIdx) {
            missingItem = formOpts[optIdx].index !== currOpts[optIdx].value;
        }
        else {
            missingItem = true;
        }
    }
    return missingItem;
}
function clearHtmlOptions(currOpts) {
    while (currOpts.length > 0) {
        currOpts.remove(0);
    }
}
function updateSelect(currOpts, formOpts) {
    var optsDiffer = areOptionsDifferent(currOpts, formOpts);
    if (optsDiffer) {
        clearHtmlOptions(currOpts);
        formOpts.map(function (logicalOpt) {
            var newHtmlOpt = document.createElement('option');
            newHtmlOpt.value = logicalOpt.index;
            newHtmlOpt.label = logicalOpt.label;
            currOpts.add(newHtmlOpt);
        });
    }
}
exports.updateSelect = updateSelect;
