"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var workflowStepMappers_1 = require("../workflowStepMappers");
var rop_1 = require("../rop/rop");
function wireActionBtnStep(formContainerId, actions, callbackUiGetter, viewGetter, viewSetter) {
    var f = function (context) {
        var view = viewGetter(context);
        var uiSignalCallback = callbackUiGetter(context);
        var _loop_1 = function (propNameIdx) {
            var action = actions[propNameIdx];
            var elem = document.getElementById(formContainerId + '_' + action.name);
            if (!elem) {
                return { value: rop_1.fail([{ errorDescription: "could not find " + (formContainerId + '_' + action.name) + " button in DOM" }]) };
            }
            elem.addEventListener('click', function (ev) {
                uiSignalCallback({ fieldName: action.name, newValue: action.value });
            });
            view[action.name] = elem;
        };
        for (var propNameIdx = 0; propNameIdx < actions.length; propNameIdx++) {
            var state_1 = _loop_1(propNameIdx);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        return rop_1.pass(viewSetter(context, view));
    };
    var step = workflowStepMappers_1.createStepFunc({
        func: f,
        name: 'wireActionBtnStep'
    });
    return step;
}
exports.wireActionBtnStep = wireActionBtnStep;
