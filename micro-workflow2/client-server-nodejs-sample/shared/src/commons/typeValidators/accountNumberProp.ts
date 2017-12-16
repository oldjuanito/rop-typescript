import { EditProp } from '../editTypes'
import { isStrDigitsOnly } from './stringValidatorUtils'

type AccountNumberProp = EditProp< string >
const MAX_CHARS = 40




export const accountNumberPropCreateStep =
    (propName: string, context: AccountNumberProp): AccountNumberProp => {

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
        return ({...context, goodVal: rawVal})

    }
export function createAccountNumberProp(currRendition: string): AccountNumberProp {
    return {
        errors: [],
        createFunc: accountNumberPropCreateStep,
        currRendition
    }
}
