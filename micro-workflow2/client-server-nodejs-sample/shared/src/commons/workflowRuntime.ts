import { ResultForWorkflow } from './editTypes'
import { fail, GOOD, pass, PropertyError } from './rop/rop'
import { AsyncMiddleWareFunc, isAsyncResult, StepTransitionFunc, SyncWorkflowStep, WorkflowStep } from './workflowStep'


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