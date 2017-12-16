import { ResultForWorkflow } from './editTypes'

export type ApplierFunc<C> = (context: C) => ResultForWorkflow<C>
export type AsyncApplierFunc<C> = (context: C) => Promise<ResultForWorkflow<C>>

export type AsyncMiddleWareFunc<C> = (stepInfo: { stepName: string }, context: C, result?: ResultForWorkflow<C>) => void


export type StepResult<C> = Promise<ResultForWorkflow<C>> | ResultForWorkflow<C>

export function isAsyncResult<C>(s: StepResult<C>): s is Promise<ResultForWorkflow<C>> {
    return (<Promise<ResultForWorkflow<C>>>s).then !== undefined;
}

export interface AsyncFuncStepDefinition<C, FunctionInput, FunctionOutput> {
    func: (context: FunctionInput) => Promise<ResultForWorkflow<FunctionOutput>>,
    preCondition?: (context: C) => ResultForWorkflow<FunctionInput>
    inputMapper?: (context: C) => FunctionInput,
    outputMapper?: (context: C, funcGoodRes: FunctionOutput) => C
    name?: string
}

export interface FuncStepDefinition<C, FunctionInput, FunctionOutput> {
    func: (context: FunctionInput) => ResultForWorkflow<FunctionOutput>,
    preCondition?: (context: C) => ResultForWorkflow<FunctionInput>
    inputMapper?: (context: C) => FunctionInput,
    outputMapper?: (context: C, funcGoodRes: FunctionOutput) => C
    name?: string
}
export type StepDefinition<C, FunctionInput, FunctionOutput> =
    AsyncFuncStepDefinition<C, FunctionInput, FunctionOutput> | FuncStepDefinition<C, FunctionInput, FunctionOutput>

export type StepTransitionFunc<C> = (inputContext: C) => StepResult<C>
export type SyncStepFunc<C> = (inputContext: C) => ResultForWorkflow<C>
export interface AsyncWorkflowStep<C> {
    name: string,
    applyFunc: StepTransitionFunc<C>
}
export interface SyncWorkflowStep<C> {
    name: string,
    applyFunc: SyncStepFunc<C>
}
export type WorkflowStep<C> = AsyncWorkflowStep<C> | SyncWorkflowStep<C>