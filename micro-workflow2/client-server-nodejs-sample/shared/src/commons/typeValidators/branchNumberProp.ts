import { EditProp } from '../editTypes'
import { isStrDigitsOnly } from './stringValidatorUtils'

type BranchNumberProp = EditProp< number >
const MAX_CHARS = 4

export const branchNumberPropCreateStep =
    (propName: string, context: BranchNumberProp): BranchNumberProp => {

        const rawVal = context.currRendition
        if (rawVal === null || rawVal === '') {
            return {...context, errors: [
                    { propName, errorDescription: `Must not be blank` } ]
            }
        }
        if (rawVal.length > MAX_CHARS) {
            return {...context, errors: [
                    {propName, errorDescription: `Must not exceed ${MAX_CHARS} digits`}]
            }
        }
        if (!isStrDigitsOnly(rawVal)) {
            return {...context, errors: [
                    {propName, errorDescription: `Must be digits only`}]
            }
        }
        const numVal = parseInt(rawVal, 0)
        if (isNaN(numVal)) {
            return {...context, errors: [
                    {propName, errorDescription: `Must be a valid number`}]
            }
        }
        return ({...context, goodVal: numVal})

    }
export function createBranchNumberProp(currRendition: string): BranchNumberProp {
    return {
        errors: [],
        createFunc: branchNumberPropCreateStep,
        currRendition
    }
}
