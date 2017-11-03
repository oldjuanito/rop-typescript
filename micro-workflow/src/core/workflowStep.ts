import {CustomPrimitiveTypeDefinition} from './types';
import {
    BasePrimitiveType,
    BasePrimitiveTypeDefinition,
    BindingPath,
    getDateValue,
    getNumericValue,
    getStringValue,
    RuntimeBasePrimitiveType,
    TypeDefinition,
    TypeDefinitionKind,
} from './types';
import {fail, pass, RopResult, PropertyError, GOOD} from '../../../udf-collector-ui/src/commons/rop/rop'

export interface FunctionInputDefinition {
    readonly name: string
    readonly inputType: TypeDefinition
}
export interface FunctionConstantInputDefinition {
    readonly name: string
    readonly inputType: BasePrimitiveTypeDefinition
}


interface InputBindingsHash {
    readonly [inputs:string]:  BindingPath
}
interface InputConstantsHash {
    readonly [inputs:string]:  string
}

interface InputValuesHash {
    [inputs:string]:  RuntimeBasePrimitiveType
}

export interface WorkflowStepInstanceDefinition {
    readonly functionDefId: string
    readonly inputBindings: InputBindingsHash
    readonly inputConstants: InputConstantsHash
    readonly replaceContext: boolean
    readonly doWhenOutputPathExists: 'replace' | 'append'
}
export interface WorkflowStepInstanceDefinitionRendition {
    readonly functionDefId: string
    readonly inputBindings: InputBindingsHash
    readonly inputConstants?: InputConstantsHash
    readonly replaceContext?: boolean
    readonly doWhenOutputPathExists?: 'replace' | 'append'
}

export function applyDefinitionDefaults(rend:WorkflowStepInstanceDefinitionRendition) {
    
    const stepInstance:WorkflowStepInstanceDefinition = {
        functionDefId: rend.functionDefId,
        inputConstants: rend.inputConstants ? rend.inputConstants : {},
        inputBindings: rend.inputBindings,
        replaceContext: rend.replaceContext ? rend.replaceContext : false,
        doWhenOutputPathExists: rend.doWhenOutputPathExists ? rend.doWhenOutputPathExists : 'replace' 
     }
     return stepInstance
}
type HashResultForWorkflow = {}
type SuccessCallback = (result:HashResultForWorkflow) => void
type FailureCallback = (err:PropertyError[]) => void
type ApplierFunc = (inputs:InputValuesHash
    , onSuccess:SuccessCallback
    , onFailure: FailureCallback) => void //we can trust that the runtime engine has provided all the inputs defined
export class WorkflowFuncDefinition {
    private inputNamesToIdx = {}
    constructor(
        readonly inputConstantsDefinitions: FunctionConstantInputDefinition[]
        , readonly inputDefinitions: FunctionInputDefinition[]
    , readonly applyFunc:ApplierFunc ) {
        for (var inputIdx = 0; inputIdx < inputDefinitions.length; inputIdx++) {
            this.inputNamesToIdx[inputDefinitions[inputIdx].name] = inputIdx;
        }
    }
    stepInstanceApply(stepInstance: WorkflowStepInstanceDefinition, 
        contextData: {}) {
            let inputValues:InputValuesHash = {            
            }
            // const inputBindingsKeys = stepInstance.inputBindings.keys
            // for (var inputBindingsIdx = 0; inputBindingsIdx < inputBindingsKeys.length; inputBindingsIdx++) {
            //     const inputKey = inputBindingsKeys[inputBindingsIdx] 
            for (var inputKey in stepInstance.inputBindings) {
                console.log('stepInstanceApply ' + inputKey)
                // const inputKey = inputBindingsKeys[inputBindingsIdx]
                const pathToValue = stepInstance.inputBindings[inputKey]
                const typeExpected = this.inputDefinitions[this.inputNamesToIdx[inputKey]].inputType
                if (typeExpected.kind === TypeDefinitionKind.CustomPrimitiveTypeDefinitionName) {
                    switch (typeExpected.basePrimitiveType) {
                        case 'number':
                            inputValues[inputKey]  = getNumericValue(pathToValue, contextData)
                            break;
                        case 'Date':
                            inputValues[inputKey]  = getDateValue(pathToValue, contextData)
                            break;
                        default: //treat as string
                            inputValues[inputKey]  = getStringValue(pathToValue, contextData)
                            break;
                    }
                }
            }
            this.applyFunc(inputValues, 
                function (result) {
                    // tell workflow of a success
                    if (stepInstance.replaceContext) {
                        // contextData[]
                    }
                }, 
                function (errs) {
                    
                }
            )
            return 
    }
    
}

// custom type definition (not the runtime data)
export const PastDateType:CustomPrimitiveTypeDefinition = { 
    kind: TypeDefinitionKind.CustomPrimitiveTypeDefinitionName,
    name: 'PastDate', 
    basePrimitiveType: 'Date'
  }
  
export const DateMustBeLessStep = new WorkflowFuncDefinition(
    [],
    [
        { name: 'date1', inputType: PastDateType },
        { name: 'date2', inputType: PastDateType }
    ],
    function (inputs, onSuccess, onFailure) {
      const ropResult = DateMustBeLess(<Date>inputs['date1'], <Date>inputs['date2'])
      switch (ropResult.kind) {
        case GOOD:
            onSuccess(ropResult.payload)
            break;
        default: 
            onSuccess(ropResult.error)
            break;
      }
    }
)
export function DateMustBeLess(date1: Date, date2: Date) {
    if (date1 > date2) {
        return fail( { errorDescription: `Must be less than ${date2.toDateString()}` }  )
    } else {
        return pass(date1)
    } 
}