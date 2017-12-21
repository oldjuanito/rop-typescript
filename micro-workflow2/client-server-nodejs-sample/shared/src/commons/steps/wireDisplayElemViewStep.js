"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var workflowStepMappers_1 = require("../workflowStepMappers");
var rop_1 = require("../rop/rop");
function wireDisplayElemViewStepFunc(formContainerId, propNames, viewGetter, viewSetter) {
    return function (context) {
        var view = viewGetter(context) || {};
        for (var propNameIdx = 0; propNameIdx < propNames.length; propNameIdx++) {
            var prop = propNames[propNameIdx];
            var elem = document.getElementById(formContainerId + '_' + prop.name);
            view[prop.name] = elem;
        }
        return rop_1.pass(viewSetter(context, view));
    };
}
exports.wireDisplayElemViewStepFunc = wireDisplayElemViewStepFunc;
function wireDisplayElemViewStep(formContainerId, propNames, viewGetter, viewSetter) {
    var f = wireDisplayElemViewStepFunc(formContainerId, propNames, viewGetter, viewSetter);
    var step = workflowStepMappers_1.createStepFunc({
        func: f,
        name: 'wireDisplayElemViewStep'
    });
    return step;
}
exports.wireDisplayElemViewStep = wireDisplayElemViewStep;
