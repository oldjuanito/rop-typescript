import { ResultForWorkflow } from './editTypes'
import { BAD, fail, GOOD, pass } from './rop/rop'
import { AsyncFuncStepDefinition, FuncStepDefinition, StepResult, SyncWorkflowStep, WorkflowStep } from './workflowStep'

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

export function mapResult<C, FunctionOutput>(inputResult: ResultForWorkflow<FunctionOutput>,
                                             outputMapper: (funcGoodRes: FunctionOutput) => C): ResultForWorkflow<C> {

    switch (inputResult.kind) {
        case GOOD:
            return pass(outputMapper(inputResult.payload as FunctionOutput))
        default:
            return fail(inputResult.error)
    }

}

export function mapPromise<C, FunctionOutput>(promise: Promise<ResultForWorkflow<FunctionOutput>>,
                                              outputMapper: (funcGoodRes: FunctionOutput) => C): Promise<ResultForWorkflow<C>> {

    return new Promise((resolve, reject) => {
        promise.then((res: ResultForWorkflow<FunctionOutput>) => {
            switch (res.kind) {
                case GOOD:
                    resolve(pass(outputMapper(res.payload)))
                    break
                default:
                    resolve(fail(res.error))
                    break
            }
        });
    });
}

export function createAsyncStepFunc<C, FunctionInput, FunctionOutput>(
    step: AsyncFuncStepDefinition<C, FunctionInput, FunctionOutput>
     ): WorkflowStep<C> {
    return {
        name: step.name || step.func.name,
        applyFunc:
            (context: C ) => {
                return new Promise((resolve, reject) => {

                    if (step.preCondition) {
                        const preCondRes = step.preCondition(context)
                        if (preCondRes.kind === BAD) {
                            resolve(fail(preCondRes.error))
                        }
                    }
                    let mappedInput: FunctionInput = step.inputMapper ? step.inputMapper(context) : context as any as FunctionInput
                    step.func(mappedInput).then((res: ResultForWorkflow<FunctionOutput>) => {
                        switch (res.kind) {
                            case GOOD:
                                resolve(pass(step.outputMapper ?
                                    step.outputMapper(context, res.payload) : res.payload as any as C))
                                break
                            default:
                                resolve(fail(res.error))
                                break
                        }
                    });
                });
    }

    }
}

export function createStepFunc<C, FunctionInput, FunctionOutput>(
    step: FuncStepDefinition<C, FunctionInput, FunctionOutput>
): SyncWorkflowStep<C> {
    return {
        name: step.name || step.func.name,
        applyFunc: (context: C ) => {
            if (step.preCondition) {
                const preCondRes = step.preCondition(context)
                if (preCondRes.kind === BAD) {
                    return (fail(preCondRes.error))
                }
            }
            let mappedInput: FunctionInput = step.inputMapper ? step.inputMapper(context) : context as any as FunctionInput
            const res: ResultForWorkflow<FunctionOutput> = step.func(mappedInput)
            switch (res.kind) {
                case GOOD:
                    return (pass(step.outputMapper ?
                        step.outputMapper(context, res.payload) : res.payload as any as C))
                default:
                    return (fail(res.error))
            }
        }
    }
}

export interface AllStateContext<LiteralTypes, FuncInput> {
    kind: LiteralTypes,
    input: FuncInput
}

export function mapPromiseResultState<LiteralTypes,
    FuncInput, FuncOutput>(typeInput: LiteralTypes, typeOutput: LiteralTypes,
                           func: (input: FuncInput) => Promise<ResultForWorkflow<FuncOutput>>,
                           initialState: AllStateContext<LiteralTypes, FuncInput>):
        StepResult<AllStateContext<LiteralTypes, FuncOutput>> {
    if (initialState.kind === typeInput) {
        const funcResult = func(initialState.input as  FuncInput)
        return mapPromise(
            funcResult,
            (funcGoodRes: FuncOutput): AllStateContext<LiteralTypes, FuncOutput> => {
                return {kind: typeOutput, input: funcGoodRes}
            }
        )
    } else {
        return fail([{
            errorDescription: `wrong input context, expecting ${typeInput}`,
            propName: 'mapPromiseState'
        }])
    }
}

export function mapResultState<LiteralTypes, FuncInput, FuncOutput>(typeInput: LiteralTypes, typeOutput: LiteralTypes,
                                                                    func: (input: FuncInput) => ResultForWorkflow<FuncOutput>,
                                                                    initialState: AllStateContext<LiteralTypes, FuncInput>): StepResult<AllStateContext<LiteralTypes, FuncOutput>> {
    if (initialState.kind === typeInput) {
        const funcResult = func(initialState.input as FuncInput)
        return mapResult(
            funcResult,
            (funcGoodRes: FuncOutput): AllStateContext<LiteralTypes, FuncOutput> => {
                return {kind: typeOutput, input: funcGoodRes}
            }
        )
    } else {
        return fail([{
            errorDescription: `wrong input context, expecting ${typeInput}`,
            propName: 'mapPromiseState'
        }])
    }
}

export function checkKindFunc<I>(typeInput: string): (context: any) => ResultForWorkflow<I> {
    return (context: any) => {
        const {kind, input} = context as any as { kind: string, input: I }
        if (kind === typeInput) {
            return pass(input as I)
        }
        return fail([{
            errorDescription: `wrong input context, expecting ${typeInput}`,
            propName: 'mapPromiseState'
        }])
    }
}