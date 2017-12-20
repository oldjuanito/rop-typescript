import { ResultForWorkflow } from './editTypes'
import { fail, GOOD, pass, PropertyError } from './rop/rop'
import {
    AsyncMiddleWareFunc, AsyncWorkflowStep, isAsyncResult, StepTransitionFunc, SyncStepFunc, SyncWorkflowStep,
    WorkflowStep
} from './workflowStep'

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

function runMiddleware<C>(middleWare: AsyncMiddleWareFunc<C>[], step: StepTransitionFunc<C>, currContextData: C,
                       lastResult: ResultForWorkflow<C>) {
    for (let middleWareIdx = 0; middleWareIdx < middleWare.length; middleWareIdx++) {
        middleWare[middleWareIdx]({stepName: step.name}, currContextData, lastResult)
    }
}
function runMiddleware2<C>(middleWare: AsyncMiddleWareFunc<C>[], step: WorkflowStep<C>, currContextData: C,
                          lastResult: ResultForWorkflow<C>) {
    for (let middleWareIdx = 0; middleWareIdx < middleWare.length; middleWareIdx++) {
        middleWare[middleWareIdx]({stepName: step.name}, currContextData, lastResult)
    }
}

export async function runAsyncWorkflow<C>(steps: StepTransitionFunc<C>[], contextData: C,
                                          preMiddleWare: AsyncMiddleWareFunc<C>[] = [],
                                          postMiddleWare: AsyncMiddleWareFunc<C>[] = []): Promise<ResultForWorkflow<C>> {

    let currErrors: PropertyError[] = []
    let currContextData: C = contextData
    let lastResult: ResultForWorkflow<C> = pass(currContextData)
    let stepIdx = 0
    let currStepName = ''
    for (; stepIdx < steps.length && currErrors.length === 0; stepIdx++) {
        const step = steps[stepIdx];
        try {
            currStepName = step.name
            runMiddleware(preMiddleWare, step, currContextData, lastResult)
            const stepResult = step(currContextData)
            if (isAsyncResult(stepResult)) {
                lastResult = await stepResult
            } else {
                lastResult = stepResult
            }
            switch (lastResult.kind) {
                case GOOD:
                    currContextData = lastResult.payload
                    break
                default:
                    currErrors = lastResult.error
                    break
            }
            runMiddleware(postMiddleWare, step, currContextData, lastResult)
        } catch (e) {
            currErrors.push({
                errorDescription: `exception occurred when running workflow (step index: ${stepIdx}, ${currStepName}): ${e.message}`,
                propName: 'runAsyncWorkflow'
            })
            lastResult = fail(currErrors)
        }
    }
    return new Promise((resolve: (res: ResultForWorkflow<C>) => void, reject) => {
        resolve(lastResult)
    })
}

export async function runAsyncWorkflowParallel<C>(steps: AsyncWorkflowStep<C>[], contextData: C,
                                           preMiddleWare: AsyncMiddleWareFunc<C>[] = [],
                                           postMiddleWare: AsyncMiddleWareFunc<C>[] = []): Promise<ResultForWorkflow<C>> {

    let currErrors: PropertyError[] = []
    let currContextData: C = contextData
    let lastResult: ResultForWorkflow<C> = pass(currContextData)
    let allResultPromises: Promise<ResultForWorkflow<C>>[] = []
    let stepIdx = 0
    let currStepName = ''
    for (; stepIdx < steps.length && currErrors.length === 0; stepIdx++) {
        const step = steps[stepIdx];
        try {
            currStepName = step.name
            runMiddleware2(preMiddleWare, step, currContextData, lastResult)
            const stepResult = step.applyFunc(currContextData)
            if (isAsyncResult(stepResult)) {
                allResultPromises.push(stepResult)
            }
            
            // TODO collect all result? then check them one by one?

        } catch (e) {
            currErrors.push({
                errorDescription: `exception occurred when running workflow (step index: ${stepIdx}, ${currStepName}): ${e.message}`,
                propName: 'runAsyncWorkflow'
            })
            lastResult = fail(currErrors)
        }
    }
    const allResults = await Promise.all(allResultPromises);
    for (stepIdx = 0; stepIdx < allResults.length ; stepIdx++) {
        lastResult = allResults[stepIdx]
        switch (lastResult.kind) {
            case GOOD:
                currContextData = lastResult.payload
                break
            default:
                currErrors = currErrors.concat(lastResult.error)
                break
        }
    }

    return new Promise((resolve: (res: ResultForWorkflow<C>) => void, reject) => {
        if (currErrors.length === 0) {
            resolve(lastResult)
        } else {
            resolve(fail(currErrors))
        }

    })
}

export async function runAsyncWorkflow2<C>(steps: WorkflowStep<C>[], contextData: C,
                                          preMiddleWare: AsyncMiddleWareFunc<C>[] = [],
                                          postMiddleWare: AsyncMiddleWareFunc<C>[] = []): Promise<ResultForWorkflow<C>> {

    let currErrors: PropertyError[] = []
    let currContextData: C = contextData
    let lastResult: ResultForWorkflow<C> = pass(currContextData)
    let stepIdx = 0
    let currStepName = ''
    for (; stepIdx < steps.length && currErrors.length === 0; stepIdx++) {
        const step = steps[stepIdx];
        try {
            currStepName = step.name
            runMiddleware2(preMiddleWare, step, currContextData, lastResult)
            const stepResult = step.applyFunc(currContextData)
            if (isAsyncResult(stepResult)) {
                lastResult = await stepResult
            } else {
                lastResult = stepResult
            }
            switch (lastResult.kind) {
                case GOOD:
                    currContextData = lastResult.payload
                    break
                default:
                    currErrors = lastResult.error
                    break
            }
            runMiddleware2(postMiddleWare, step, currContextData, lastResult)
        } catch (e) {
            currErrors.push({
                errorDescription: `exception occurred when running workflow (step index: ${stepIdx}, ${currStepName}): ${e.message}`,
                propName: 'runAsyncWorkflow'
            })
            lastResult = fail(currErrors)
        }
    }
    return new Promise((resolve: (res: ResultForWorkflow<C>) => void, reject) => {
        resolve(lastResult)
    })
}

export function runWorkflow2<C>(steps: SyncWorkflowStep<C>[], contextData: C,
                                           preMiddleWare: AsyncMiddleWareFunc<C>[] = [],
                                           postMiddleWare: AsyncMiddleWareFunc<C>[] = []):
ResultForWorkflow<C> {

    let currErrors: PropertyError[] = []
    let currContextData: C = contextData
    let lastResult: ResultForWorkflow<C> = pass(currContextData)
    let stepIdx = 0
    let currStepName = ''
    for (; stepIdx < steps.length && currErrors.length === 0; stepIdx++) {
        const step = steps[stepIdx];
        try {
            currStepName = step.name
            runMiddleware2(preMiddleWare, step, currContextData, lastResult)
            const stepResult = step.applyFunc(currContextData)

            lastResult = stepResult
            switch (lastResult.kind) {
                case GOOD:
                    currContextData = lastResult.payload
                    break
                default:
                    currErrors = lastResult.error
                    break
            }
            runMiddleware2(postMiddleWare, step, currContextData, lastResult)
        } catch (e) {
            currErrors.push({
                errorDescription: `exception occurred when running workflow (step index: ${stepIdx}, ${currStepName}): ${e.message}`,
                propName: 'runWorkflow'
            })
            lastResult = fail(currErrors)
        }
    }
    return lastResult
}

export interface SyncWorkflowDefinition<C> {
    steps: SyncWorkflowStep<C>[],
    preMiddleWare: AsyncMiddleWareFunc<C>[],
    postMiddleWare: AsyncMiddleWareFunc<C>[]
}

export function runSyncWorkflowStep<C, SubWorkflowContext>(
    workflowDefinition: SyncWorkflowDefinition<SubWorkflowContext>,
    contextMapper: (context:C) => SubWorkflowContext,
    successMapper: (context:C, succesRes: SubWorkflowContext) => C,
    failureMapper: (context:C, errs: PropertyError[]) => C)
: SyncStepFunc<C>{
    return (inputContext: C) => {
        const workflowRes = runWorkflow2(workflowDefinition.steps,
            contextMapper(inputContext),
            workflowDefinition.preMiddleWare,
            workflowDefinition.postMiddleWare
        )
        const newParentContext = workflowRes.kind === GOOD ?
            successMapper(inputContext, workflowRes.payload)
            : failureMapper(inputContext, workflowRes.error)
        return pass(newParentContext)
    }
}


export interface AsyncWorkflowDefinition<C> {
    steps: WorkflowStep<C>[],
    preMiddleWare: AsyncMiddleWareFunc<C>[],
    postMiddleWare: AsyncMiddleWareFunc<C>[]
}

export function runAsyncWorkflowStep<C, SubWorkflowContext>(
    stepName: string,
    workflowDefinition: AsyncWorkflowDefinition<SubWorkflowContext>,
    contextMapper: (context:C) => SubWorkflowContext,
    successMapper: (context:C, succesRes: SubWorkflowContext) => C)
: WorkflowStep<C>{
    const applyFunc = (inputContext: C) => {
        const workflowResPromise = runAsyncWorkflow2(workflowDefinition.steps,
            contextMapper(inputContext),
            workflowDefinition.preMiddleWare,
            workflowDefinition.postMiddleWare
        )
        return workflowResPromise.then( workflowRes => {
            return new Promise((resolve: (res: ResultForWorkflow<C>) => void, reject) => {
                    if (workflowRes.kind === GOOD) {
                        resolve(pass(successMapper(inputContext, workflowRes.payload)))
                    } else {
                        resolve(fail(workflowRes.error))
                    }
                }
            )
        })
    }
    return {
        name: stepName,
        applyFunc
    }
}

// see https://github.com/samartioli/node-play-by-play/blob/master/routes/pet.js for parallel async
export function runAsyncWorkflowParallelStep<C, SubWorkflowContext>(
    stepName: string,
    workflowDefinition: AsyncWorkflowDefinition<SubWorkflowContext>,
    contextMapper: (context:C) => SubWorkflowContext,
    successMapper: (context:C, succesRes: SubWorkflowContext) => C)
: WorkflowStep<C>{
    const applyFunc = (inputContext: C) => {
        const workflowResPromise = runAsyncWorkflowParallel(workflowDefinition.steps,
            contextMapper(inputContext),
            workflowDefinition.preMiddleWare,
            workflowDefinition.postMiddleWare
        )
        return workflowResPromise.then( workflowRes => {
            return new Promise((resolve: (res: ResultForWorkflow<C>) => void, reject) => {
                    if (workflowRes.kind === GOOD) {
                        resolve(pass(successMapper(inputContext, workflowRes.payload)))
                    } else {
                        resolve(fail(workflowRes.error))
                    }
                }
            )
        })
    }
    return {
        name: stepName,
        applyFunc
    }
}
export function runAsyncWorkflowStep2<C, SubWorkflowContext>(
    stepName: string,
    workflowDefinition: AsyncWorkflowDefinition<SubWorkflowContext>,
    contextMapper: (context:C) => SubWorkflowContext,
    successMapper: (context:C, succesRes: SubWorkflowContext) => C,
    failureMapper: (context:C, errs: PropertyError[]) => C)
: WorkflowStep<C>{
    const applyFunc = (inputContext: C) => {
        const workflowResPromise = runAsyncWorkflow2(workflowDefinition.steps,
            contextMapper(inputContext),
            workflowDefinition.preMiddleWare,
            workflowDefinition.postMiddleWare
        )
        return workflowResPromise.then( workflowRes => {
                const newParentContext = workflowRes.kind === GOOD ?
                    successMapper(inputContext, workflowRes.payload)
                    : failureMapper(inputContext, workflowRes.error)
                return new Promise((resolve: (res: ResultForWorkflow<C>) => void, reject) => {
                    resolve(pass(newParentContext))
                })
            }
        )
    }
    return {
        name: stepName,
        applyFunc
    }
}