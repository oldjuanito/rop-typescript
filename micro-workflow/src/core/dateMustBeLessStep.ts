import {GOOD, pass, fail} from "../../../udf-collector-ui/src/commons/rop/rop";
import {PastDateType, WorkflowFuncDefinition} from "./workflowStep";

export function DateMustBeLess(date1: Date, date2: Date) {
    if (date1 > date2) {
        return fail({errorDescription: `Must be less than ${date2.toDateString()}`})
    } else {
        return pass(date1)
    }
}

export const DateMustBeLessStep = new WorkflowFuncDefinition(
    [],
    [
        {name: 'date1', inputType: PastDateType},
        {name: 'date2', inputType: PastDateType}
    ],
    {kind: 'Date'},
    function (inputs) {
        const ropResult = DateMustBeLess(<Date>inputs['date1'], <Date>inputs['date2'])
        switch (ropResult.kind) {
            case GOOD:
                return pass(ropResult.payload); // what gets returned at runtime
            default:
                return fail([ropResult.error]);
        }
    }
)