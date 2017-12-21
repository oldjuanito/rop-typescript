"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var workflowStepMappers_1 = require("../workflowStepMappers");
var rop_1 = require("../rop/rop");
var dropdownUtils_1 = require("../presentation/dropdownUtils");
function setDropDownViewOptsStep(props, viewGetter) {
    var f = function (context) {
        var view = viewGetter(context);
        for (var propNameIdx = 0; propNameIdx < props.length; propNameIdx++) {
            var prop = props[propNameIdx];
            var newOpts = prop.opsGetter(context);
            var selectElem = view[prop.name];
            dropdownUtils_1.updateSelect(selectElem.options, newOpts);
        }
        return rop_1.pass(context);
    };
    var step = workflowStepMappers_1.createStepFunc({
        func: f,
        name: 'setDropDownViewOptsStep'
    });
    return step;
}
exports.setDropDownViewOptsStep = setDropDownViewOptsStep;
