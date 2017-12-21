"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rop_1 = require("../rop/rop");
var workflowStepMappers_1 = require("../workflowStepMappers");
function addValueChgListener(elem, fieldName, callbackUi) {
    elem.addEventListener('change', function (_) {
        callbackUi({
            fieldName: fieldName,
            newValue: elem.value
        });
    });
}
exports.addValueChgListener = addValueChgListener;
function createTextInputStep(formContainerId, propNames, callbackUi, viewGetter, viewSetter) {
    var f = function (context) {
        var view = viewGetter(context);
        for (var propNameIdx = 0; propNameIdx < propNames.length; propNameIdx++) {
            var prop = propNames[propNameIdx];
            var elemLbl = document.createElement('label');
            elemLbl.htmlFor = formContainerId + '_' + prop.name;
            var elem = document.createElement('input');
            elem.type = prop.primitiveType;
            elem.id = formContainerId + '_' + prop.name;
            addValueChgListener(elem, prop.name, callbackUi);
            var fieldContainer = {
                label: elemLbl,
                field: elem
            };
            view[prop.name] = fieldContainer;
        }
        return rop_1.pass(viewSetter(context, view));
    };
    var step = workflowStepMappers_1.createStepFunc({
        func: f,
        name: 'createTextInputStep'
    });
    return step;
}
exports.createTextInputStep = createTextInputStep;
