"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rop_1 = require("./rop/rop");
// export function mapPureFuncStep<C, FunctionInput, FunctionOutput>(stepName: string,
//                                                                   applyFunc: (context: FunctionInput | C) => ResultForWorkflow<FunctionOutput | C>,
//                                                                   inputMapper?: (context: C) => FunctionInput,
//                                                                   outputMapper?: (context: C, funcGoodRes: FunctionOutput) => C,) {
//     let applyFuncToUse = applyFunc
//     if (inputMapper) {
//         applyFuncToUse = (context: C) => {
//             return applyFunc(inputMapper(context))
//         }
//     }
//     if (outputMapper) {
//         const currApplyFuncToUse = applyFuncToUse
//         applyFuncToUse = (context: C) => {
//             const res = currApplyFuncToUse(context)
//             switch (res.kind) {
//                 case GOOD:
//                     return pass(outputMapper(context, res.payload as FunctionOutput))
//                 default:
//                     return fail(res.error)
//             }
//         }
//     }
//     return new WorkflowStep<C>(
//         stepName,
//         applyFuncToUse as ApplierFunc<C>)
//
// }
function mapResult(inputResult, outputMapper) {
    switch (inputResult.kind) {
        case rop_1.GOOD:
            return rop_1.pass(outputMapper(inputResult.payload));
        default:
            return rop_1.fail(inputResult.error);
    }
}
exports.mapResult = mapResult;
function mapPromise(promise, outputMapper) {
    return new Promise(function (resolve, reject) {
        promise.then(function (res) {
            switch (res.kind) {
                case rop_1.GOOD:
                    resolve(rop_1.pass(outputMapper(res.payload)));
                    break;
                default:
                    resolve(rop_1.fail(res.error));
                    break;
            }
        });
    });
}
exports.mapPromise = mapPromise;
function createAsyncStepFunc(step) {
    return {
        name: step.name || step.func.name,
        applyFunc: function (context) {
            return new Promise(function (resolve, reject) {
                if (step.preCondition) {
                    var preCondRes = step.preCondition(context);
                    if (preCondRes.kind === rop_1.BAD) {
                        resolve(rop_1.fail(preCondRes.error));
                    }
                }
                var mappedInput = step.inputMapper ? step.inputMapper(context) : context;
                step.func(mappedInput).then(function (res) {
                    switch (res.kind) {
                        case rop_1.GOOD:
                            resolve(rop_1.pass(step.outputMapper ?
                                step.outputMapper(context, res.payload) : res.payload));
                            break;
                        default:
                            resolve(rop_1.fail(res.error));
                            break;
                    }
                });
            });
        }
    };
}
exports.createAsyncStepFunc = createAsyncStepFunc;
function createStepFunc(step) {
    return {
        name: step.name || step.func.name,
        applyFunc: function (context) {
            if (step.preCondition) {
                var preCondRes = step.preCondition(context);
                if (preCondRes.kind === rop_1.BAD) {
                    return (rop_1.fail(preCondRes.error));
                }
            }
            var mappedInput = step.inputMapper ? step.inputMapper(context) : context;
            var res = step.func(mappedInput);
            switch (res.kind) {
                case rop_1.GOOD:
                    return (rop_1.pass(step.outputMapper ?
                        step.outputMapper(context, res.payload) : res.payload));
                default:
                    return (rop_1.fail(res.error));
            }
        }
    };
}
exports.createStepFunc = createStepFunc;
function mapPromiseResultState(typeInput, typeOutput, func, initialState) {
    if (initialState.kind === typeInput) {
        var funcResult = func(initialState.input);
        return mapPromise(funcResult, function (funcGoodRes) {
            return { kind: typeOutput, input: funcGoodRes };
        });
    }
    else {
        return rop_1.fail([{
                errorDescription: "wrong input context, expecting " + typeInput + ", got " + initialState.kind,
                propName: 'mapPromiseState'
            }]);
    }
}
exports.mapPromiseResultState = mapPromiseResultState;
function mapResultState(typeInput, typeOutput, func, initialState) {
    if (initialState.kind === typeInput) {
        var funcResult = func(initialState.input);
        return mapResult(funcResult, function (funcGoodRes) {
            return { kind: typeOutput, input: funcGoodRes };
        });
    }
    else {
        return rop_1.fail([{
                errorDescription: "wrong input context, expecting " + typeInput,
                propName: 'mapPromiseState'
            }]);
    }
}
exports.mapResultState = mapResultState;
function checkKindFunc(typeInput) {
    return function (context) {
        var _a = context, kind = _a.kind, input = _a.input;
        if (kind === typeInput) {
            return rop_1.pass(input);
        }
        return rop_1.fail([{
                errorDescription: "wrong input context, expecting " + typeInput,
                propName: 'mapPromiseState'
            }]);
    };
}
exports.checkKindFunc = checkKindFunc;
