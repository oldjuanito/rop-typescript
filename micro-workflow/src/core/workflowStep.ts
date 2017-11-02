import {fail, pass} from '../../../udf-collector-ui/src/commons/rop/rop'
export class DateWorkflowStep {
    constructor() {

    }
}

export function DateMustBeLess(date1: Date, date2: Date) {
    if (date1 > date2) {
        return fail( { errorDescription: `Must be less than ${date2.toDateString()}` }  )
    } else {
        return pass(date1)
    } 
}