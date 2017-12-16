"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var workflowRuntime_1 = require("../../workflowRuntime");
var rop_1 = require("../../rop/rop");
function assertSuccesfulWorkflow(intialContext, exptectedFinalContext, instances) {
    var lastResult = workflowRuntime_1.RunWorkflow(instances, intialContext, []);
    // assert
    expect(lastResult).toEqual({ kind: rop_1.GOOD, payload: exptectedFinalContext });
}
exports.assertSuccesfulWorkflow = assertSuccesfulWorkflow;
function assertFailedWorkflow(intialContext, expectedErros, instances) {
    var lastResult = workflowRuntime_1.RunWorkflow(instances, intialContext, []);
    // assert
    expect(lastResult).toEqual({ kind: rop_1.BAD, error: expectedErros });
}
exports.assertFailedWorkflow = assertFailedWorkflow;
function assertSuccesfulAsyncWorkflow(intialContext, expectedFinalContext, instances) {
    var lastResult = workflowRuntime_1.runAsyncWorkflow(instances, intialContext, [], []);
    // assert
    expect(lastResult).toEqual({ kind: rop_1.GOOD, payload: expectedFinalContext });
}
exports.assertSuccesfulAsyncWorkflow = assertSuccesfulAsyncWorkflow;
