"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rop_1 = require("../rop/rop");
var workflowStepMappers_1 = require("../workflowStepMappers");
var paragraphUtils_1 = require("../presentation/paragraphUtils");
function setErrorViewValuesStep(viewGetter, renditionGetter) {
    var f = function (context) {
        var view = viewGetter(context);
        var rendition = renditionGetter(context);
        paragraphUtils_1.updateErrorList(view, rendition);
        return rop_1.pass(context);
    };
    var step = workflowStepMappers_1.createStepFunc({
        func: f,
        name: 'setErrorViewValuesStep'
    });
    return step;
}
exports.setErrorViewValuesStep = setErrorViewValuesStep;
