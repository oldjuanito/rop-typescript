import { EditProp, ResultForWorkflow } from '../editTypes'
import { fail, pass, PropertyError } from '../rop/rop'

export interface EditPropHash {
    [propName: string]: EditProp<{}>
}

export function createValidPropHash(propsToCheck: EditPropHash): ResultForWorkflow<EditPropHash> {

    let errs: PropertyError[] = []
    for (var key in propsToCheck) {
        if (propsToCheck.hasOwnProperty(key)) {
            const propToCheck = propsToCheck[key]
            propsToCheck[key] = propToCheck.createFunc(key, propToCheck)
            errs = errs.concat(propsToCheck[key].errors)
        }
    }

    if (errs.length > 0) {
        return fail(errs)
    } else {
        return pass(propsToCheck)
    }
}