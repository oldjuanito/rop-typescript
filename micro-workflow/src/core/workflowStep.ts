import {TypeDefinition, BindingPath} from './types';
import {fail, pass} from '../../../udf-collector-ui/src/commons/rop/rop'

export interface FunctionInputDefinition {
    readonly name: string
    readonly inputType: TypeDefinition
}

interface InputBindingsHash {
    readonly [inputs:string]:  BindingPath
}

export interface WorkflowStepInstanceDefinition {
    readonly functionDefId: string
    readonly inputBindings: InputBindingsHash
    readonly ReplaceContext: boolean
    readonly DoWhenOutputPathExists: 'replace' | 'append'
}

export interface WorkflowFuncDefinition {
    readonly InputDefinitions: FunctionInputDefinition[]
    
}

export function stepInstanceApply(stepInstance: WorkflowStepInstanceDefinition, funcDef: WorkflowFuncDefinition, contextData: {}) {
    return 
}
export function DateMustBeLess(date1: Date, date2: Date) {
    if (date1 > date2) {
        return fail( { errorDescription: `Must be less than ${date2.toDateString()}` }  )
    } else {
        return pass(date1)
    } 
}