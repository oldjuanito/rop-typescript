"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rop_1 = require("../rop/rop");
var workflowStepMappers_1 = require("../workflowStepMappers");
function clearTableBody(table) {
    var bodies = table.tBodies;
    if (bodies.length > 0) {
        while (bodies[0].rows.length > 0) {
            bodies[0].deleteRow(0);
        }
    }
    else {
        table.createTBody();
    }
}
function setTableDataViewValuesStep(parameters) {
    var viewGetter = parameters.viewGetter, renditionGetter = parameters.renditionGetter;
    var specialRenderers = parameters.specialRenderers ? parameters.specialRenderers : {};
    var f = function (context) {
        var errors = [];
        var view = viewGetter(context);
        var rendition = renditionGetter(context);
        var headers = view.tHead.rows[0].cells;
        var propsToUse = [];
        for (var headerIdx = 0; headerIdx < headers.length; headerIdx++) {
            var header = headers[headerIdx];
            var propName = header.getAttribute('data-prop-name');
            if (propName) {
                propsToUse.push(propName);
            }
        }
        clearTableBody(view);
        var tableBody = view.tBodies[0];
        for (var rowIdx = 0; rowIdx < rendition.length; rowIdx++) {
            var row = rendition[rowIdx];
            var newRow = tableBody.insertRow();
            for (var propNameIdx = 0; propNameIdx < propsToUse.length; propNameIdx++) {
                var propName = propsToUse[propNameIdx];
                if (row.hasOwnProperty(propName)) {
                    var newCell = newRow.insertCell();
                    if (specialRenderers[propName]) {
                        newCell.appendChild(specialRenderers[propName](row, context));
                    }
                    else {
                        newCell.innerText = row[propName];
                    }
                }
                else {
                    errors.push({ errorDescription: "cell cannot use " + propName + " as property value. It does not exist in " + JSON.stringify(row) + "." });
                }
            }
        }
        if (errors.length > 0) {
            return rop_1.fail(errors);
        }
        return rop_1.pass(context);
    };
    var step = workflowStepMappers_1.createStepFunc({
        func: f,
        name: 'setTableDataViewValuesStep'
    });
    return step;
}
exports.setTableDataViewValuesStep = setTableDataViewValuesStep;
