import { MsgType } from './__tests__/helpers/testHelpers'
import { anonymousType, BaseBoolean,  CustomHashTypeDefinition, BaseString } from './types'
import { GOOD, pass, fail } from '../../../udf-collector-ui/src/commons/rop/rop'
import { FunctionInputDefinition, PastDateType, InputConstantsHash, WorkflowFuncDefinition, InputValuesHash } from './workflowStep'

export function updateFormFromTextMsg(inputs: {}, inputConstants: InputConstantsHash, 
                                      paramTypes: FunctionInputDefinition[]) {
    
    return pass(true)
    // call sp using paramsToUse
}

export const UpdateFormFromTextMsg = new WorkflowFuncDefinition(
    [
        {name: 'modelType', inputType: BaseString }
    ],
    [
        {name: 'msg', inputType: MsgType },
        // {name: 'currValues', inputType: anonymousType }
    ],
    anonymousType, 
    function (inputs: InputValuesHash, inputConstants: InputConstantsHash, 
              inputDefinitionsUsed: FunctionInputDefinition[]) {
        const ropResult = updateFormFromTextMsg(inputs, inputConstants, inputDefinitionsUsed) //
        switch (ropResult.kind) {
            case GOOD:
                return pass(ropResult.payload) // what gets returned at runtime
            default:
                return fail([])
        }
    },
    function (inputs: InputConstantsHash, definition: WorkflowFuncDefinition) {
        // generate the input and output types based on the constants 

    },
    function (inputs: InputValuesHash, inputConstants: InputConstantsHash, 
              inputDefinitionsUsed: FunctionInputDefinition[]) {
        console.log('I am in test mode!')
        return pass(false) 
    }
)