import { anonymousType, CustomHashTypeDefinition, TypeDefinitionKind } from './types';
import { FuncDefinitionHash, ResultForWorkflow, WorkflowStepInstanceDefinition } from './workflowStep'
import { setValueInBindingPath } from './bindingPathHelpers'
import { PropertyError, GOOD, pass } from '../../../udf-collector-ui/src/commons/rop/rop'

export function RunWorkflowInTestMode(globalFuncDefs: FuncDefinitionHash, instances: WorkflowStepInstanceDefinition[], 
                                      contextType: CustomHashTypeDefinition, contextData: {}) { 
    let lastResult: ResultForWorkflow = pass(contextData)
    let currErrors: PropertyError[] = []
    for (var stepIdx = 0; stepIdx < instances.length && currErrors.length === 0; stepIdx++ ) {
        const currStepInstance = instances[stepIdx]
        lastResult = globalFuncDefs[currStepInstance.functionDefId].stepInstanceApplyTest(currStepInstance, contextData)
        
        switch (lastResult.kind) {
            case GOOD:
                setValueInBindingPath(contextType, currStepInstance.outputBinding, contextData, 
                                      lastResult.payload, currStepInstance.doWhenOutputPathExists === 'append')
                break
            default:
                currErrors = lastResult.error
                break
        }
    }
    return lastResult
}
export function RunWorkflow(globalFuncDefs: FuncDefinitionHash, instances: WorkflowStepInstanceDefinition[], 
                            contextType: CustomHashTypeDefinition, contextData: {}) { 
    let lastResult: ResultForWorkflow = pass(contextData)
    let currErrors: PropertyError[] = []
    for (var stepIdx = 0; stepIdx < instances.length && currErrors.length === 0; stepIdx++ ) {
        const currStepInstance = instances[stepIdx]
        const currFuncDefinition = globalFuncDefs[currStepInstance.functionDefId]
        lastResult = currFuncDefinition.stepInstanceApply(currStepInstance, contextData)
        const newTypeToAdd = currFuncDefinition.outputType
        const whereToAddIt = currStepInstance.outputBinding
        switch (lastResult.kind) {
            case GOOD:
                setValueInBindingPath(contextType, currStepInstance.outputBinding, contextData, 
                                      lastResult.payload, currStepInstance.doWhenOutputPathExists === 'append')
                console.log('Step done: ' + JSON.stringify(contextData))
                break
            default:
                console.log('Step error: ' + JSON.stringify(lastResult.error))
                currErrors = lastResult.error
                break
        }
    }
    return lastResult
}

export function AccumulateContextType(globalFuncDefs: FuncDefinitionHash, instances: WorkflowStepInstanceDefinition[],
                                      contextType: CustomHashTypeDefinition, contextData: {}) {
    let lastResult: ResultForWorkflow = pass(contextData)
    let currErrors: PropertyError[] = []
    let lastContextType: CustomHashTypeDefinition = contextType
    for (let stepIdx = 0; stepIdx < instances.length && currErrors.length === 0; stepIdx++ ) {
        const currStepInstance = instances[stepIdx]
        const currFuncDefinition = globalFuncDefs[currStepInstance.functionDefId]
        const newTypeToAdd = currFuncDefinition.outputType
        const whereToAddIt = currStepInstance.outputBinding
        let currContextPointer = lastContextType.properties
        let currPathIdx = 0
        while (currPathIdx < whereToAddIt.length - 1) {
            let currHashPointer = <CustomHashTypeDefinition> currContextPointer[whereToAddIt[currPathIdx]]
            if (currHashPointer === undefined) {
                currHashPointer = currContextPointer[whereToAddIt[currPathIdx]] = anonymousType
            }
            currContextPointer = currHashPointer.properties
            currPathIdx++
        }
        currContextPointer[whereToAddIt[currPathIdx]] = newTypeToAdd
    }
    return lastContextType
}
