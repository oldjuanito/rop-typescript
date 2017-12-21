"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rop_1 = require("../rop/rop");
var workflowStepMappers_1 = require("../workflowStepMappers");
var createTextInputStep_1 = require("./createTextInputStep");
function wireTextInputStep(formContainerId, propNames, callbackUiGetter, viewGetter, viewSetter) {
    var f = function (context) {
        var view = viewGetter(context);
        for (var propNameIdx = 0; propNameIdx < propNames.length; propNameIdx++) {
            var prop = propNames[propNameIdx];
            var elem = document.getElementById(formContainerId + '_' + prop.name);
            createTextInputStep_1.addValueChgListener(elem, prop.name, callbackUiGetter(context));
            view[prop.name] = elem;
        }
        return rop_1.pass(viewSetter(context, view));
    };
    var step = workflowStepMappers_1.createStepFunc({
        func: f,
        name: 'wireTextInputStep'
    });
    return step;
}
exports.wireTextInputStep = wireTextInputStep;
