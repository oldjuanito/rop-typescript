"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var rop_1 = require("./rop/rop");
var workflowStep_1 = require("./workflowStep");
// export function RunWorkflow<C>(instances: WorkflowStep<C>[], contextData: C, middleWare: MiddleWareFunc<C>[] = []): ResultForWorkflow<C> {
//     let lastResult: ResultForWorkflow<C> = pass(contextData)
//     let currErrors: PropertyError[] = []
//     let currContextData: C = contextData
//     for (let stepIdx = 0; stepIdx < instances.length && currErrors.length === 0; stepIdx++) {
//         const currStepInstance = instances[stepIdx]
//         lastResult = currStepInstance.stepInstanceApply(currContextData, middleWare)
//         switch (lastResult.kind) {
//             case GOOD:
//                 currContextData = lastResult.payload
//                 break
//             default:
//                 currErrors = lastResult.error
//                 break
//         }
//     }
//     return lastResult
// }
function runMiddleware(middleWare, step, currContextData, lastResult) {
    for (var middleWareIdx = 0; middleWareIdx < middleWare.length; middleWareIdx++) {
        middleWare[middleWareIdx]({ stepName: step.name }, currContextData, lastResult);
    }
}
function runMiddleware2(middleWare, step, currContextData, lastResult) {
    for (var middleWareIdx = 0; middleWareIdx < middleWare.length; middleWareIdx++) {
        middleWare[middleWareIdx]({ stepName: step.name }, currContextData, lastResult);
    }
}
function runAsyncWorkflow(steps, contextData, preMiddleWare, postMiddleWare) {
    if (preMiddleWare === void 0) { preMiddleWare = []; }
    if (postMiddleWare === void 0) { postMiddleWare = []; }
    return __awaiter(this, void 0, void 0, function () {
        var currErrors, currContextData, lastResult, stepIdx, currStepName, step, stepResult, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currErrors = [];
                    currContextData = contextData;
                    lastResult = rop_1.pass(currContextData);
                    stepIdx = 0;
                    currStepName = '';
                    _a.label = 1;
                case 1:
                    if (!(stepIdx < steps.length && currErrors.length === 0)) return [3 /*break*/, 8];
                    step = steps[stepIdx];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 6, , 7]);
                    currStepName = step.name;
                    runMiddleware(preMiddleWare, step, currContextData, lastResult);
                    stepResult = step(currContextData);
                    if (!workflowStep_1.isAsyncResult(stepResult)) return [3 /*break*/, 4];
                    return [4 /*yield*/, stepResult];
                case 3:
                    lastResult = _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    lastResult = stepResult;
                    _a.label = 5;
                case 5:
                    switch (lastResult.kind) {
                        case rop_1.GOOD:
                            currContextData = lastResult.payload;
                            break;
                        default:
                            currErrors = lastResult.error;
                            break;
                    }
                    runMiddleware(postMiddleWare, step, currContextData, lastResult);
                    return [3 /*break*/, 7];
                case 6:
                    e_1 = _a.sent();
                    currErrors.push({
                        errorDescription: "exception occurred when running workflow (step index: " + stepIdx + ", " + currStepName + "): " + e_1.message,
                        propName: 'runAsyncWorkflow'
                    });
                    lastResult = rop_1.fail(currErrors);
                    return [3 /*break*/, 7];
                case 7:
                    stepIdx++;
                    return [3 /*break*/, 1];
                case 8: return [2 /*return*/, new Promise(function (resolve, reject) {
                        resolve(lastResult);
                    })];
            }
        });
    });
}
exports.runAsyncWorkflow = runAsyncWorkflow;
function runAsyncWorkflow2(steps, contextData, preMiddleWare, postMiddleWare) {
    if (preMiddleWare === void 0) { preMiddleWare = []; }
    if (postMiddleWare === void 0) { postMiddleWare = []; }
    return __awaiter(this, void 0, void 0, function () {
        var currErrors, currContextData, lastResult, stepIdx, currStepName, step, stepResult, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currErrors = [];
                    currContextData = contextData;
                    lastResult = rop_1.pass(currContextData);
                    stepIdx = 0;
                    currStepName = '';
                    _a.label = 1;
                case 1:
                    if (!(stepIdx < steps.length && currErrors.length === 0)) return [3 /*break*/, 8];
                    step = steps[stepIdx];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 6, , 7]);
                    currStepName = step.name;
                    runMiddleware2(preMiddleWare, step, currContextData, lastResult);
                    stepResult = step.applyFunc(currContextData);
                    if (!workflowStep_1.isAsyncResult(stepResult)) return [3 /*break*/, 4];
                    return [4 /*yield*/, stepResult];
                case 3:
                    lastResult = _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    lastResult = stepResult;
                    _a.label = 5;
                case 5:
                    switch (lastResult.kind) {
                        case rop_1.GOOD:
                            currContextData = lastResult.payload;
                            break;
                        default:
                            currErrors = lastResult.error;
                            break;
                    }
                    runMiddleware2(postMiddleWare, step, currContextData, lastResult);
                    return [3 /*break*/, 7];
                case 6:
                    e_2 = _a.sent();
                    currErrors.push({
                        errorDescription: "exception occurred when running workflow (step index: " + stepIdx + ", " + currStepName + "): " + e_2.message,
                        propName: 'runAsyncWorkflow'
                    });
                    lastResult = rop_1.fail(currErrors);
                    return [3 /*break*/, 7];
                case 7:
                    stepIdx++;
                    return [3 /*break*/, 1];
                case 8: return [2 /*return*/, new Promise(function (resolve, reject) {
                        resolve(lastResult);
                    })];
            }
        });
    });
}
exports.runAsyncWorkflow2 = runAsyncWorkflow2;
function runWorkflow2(steps, contextData, preMiddleWare, postMiddleWare) {
    if (preMiddleWare === void 0) { preMiddleWare = []; }
    if (postMiddleWare === void 0) { postMiddleWare = []; }
    var currErrors = [];
    var currContextData = contextData;
    var lastResult = rop_1.pass(currContextData);
    var stepIdx = 0;
    var currStepName = '';
    for (; stepIdx < steps.length && currErrors.length === 0; stepIdx++) {
        var step = steps[stepIdx];
        try {
            currStepName = step.name;
            runMiddleware2(preMiddleWare, step, currContextData, lastResult);
            var stepResult = step.applyFunc(currContextData);
            lastResult = stepResult;
            switch (lastResult.kind) {
                case rop_1.GOOD:
                    currContextData = lastResult.payload;
                    break;
                default:
                    currErrors = lastResult.error;
                    break;
            }
            runMiddleware2(postMiddleWare, step, currContextData, lastResult);
        }
        catch (e) {
            currErrors.push({
                errorDescription: "exception occurred when running workflow (step index: " + stepIdx + ", " + currStepName + "): " + e.message,
                propName: 'runWorkflow'
            });
            lastResult = rop_1.fail(currErrors);
        }
    }
    return lastResult;
}
exports.runWorkflow2 = runWorkflow2;
