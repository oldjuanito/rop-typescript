import {CustomHashTypeDefinition} from './types';
import {GOOD, pass, fail} from "../../../udf-collector-ui/src/commons/rop/rop";
import {FunctionInputDefinition, PastDateType, InputConstantsHash, WorkflowFuncDefinition, InputValuesHash} from './workflowStep'

export function execSql(inputs: {}, inputConstants: InputConstantsHash, paramTypes: FunctionInputDefinition[]) {
    const spToCall = inputConstants['spName']
    let paramsToUse = []
    for (var paramIdx = 0; paramIdx < paramTypes.length; paramIdx++) {
        var paramTypeToUse = paramTypes[paramIdx];
        var paramValue = inputs[paramTypeToUse.name]
        paramsToUse.push(paramValue)
    }
    return pass(true)
    // call sp using paramsToUse
}

export const ExecDbStep = new WorkflowFuncDefinition(
    [
        {name: 'spName', inputType: {kind: 'string'} }
    ],
    [
        // generate the input based on the constants???
    ],
    {kind: 'Date'}, 
    function (inputs: InputValuesHash, inputConstants: InputConstantsHash, 
              inputDefinitionsUsed: FunctionInputDefinition[]) {
        const ropResult = execSql(inputs, inputConstants, inputDefinitionsUsed) //
        switch (ropResult.kind) {
            case GOOD:
                return pass(ropResult.payload) // what gets returned at runtime
            default:
                return fail([])
        }
    },
    function (inputs: InputConstantsHash, defintion: WorkflowFuncDefinition) {
        // generate the input based on the constants 
    },
    function (inputs: InputValuesHash, inputConstants: InputConstantsHash, 
              inputDefinitionsUsed: FunctionInputDefinition[]) {
        console.log('I am in test mode!')
        return pass(false) 
    }
)