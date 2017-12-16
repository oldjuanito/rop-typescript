import { runAsyncWorkflow, runWorkflow2} from '../../workflowRuntime';
import { BAD, GOOD, PropertyError } from '../../rop/rop'
import { StepTransitionFunc, SyncWorkflowStep } from '../../workflowStep'

export function assertSuccesfulWorkflow<C>(intialContext: C, exptectedFinalContext: C,
                                           instances: SyncWorkflowStep<C>[]) {
    const lastResult = runWorkflow2<C>(instances, intialContext, [])
    // assert
    expect(lastResult).toEqual({ kind: GOOD, payload: exptectedFinalContext })
}
export function assertFailedWorkflow<C>(intialContext: C, expectedErros: PropertyError[],
                                        instances: SyncWorkflowStep<C>[],
                                        ) {
    const lastResult = runWorkflow2<C>(instances, intialContext, [])
    // assert
    expect(lastResult).toEqual({ kind: BAD, error: expectedErros})
}


export function assertSuccesfulAsyncWorkflow<C>(intialContext: C, expectedFinalContext: C,
                                           instances: StepTransitionFunc<C>[]) {
    const lastResult = runAsyncWorkflow<C>(instances, intialContext, [],[])
    // assert
    expect(lastResult).toEqual({ kind: GOOD, payload: expectedFinalContext })
}