import { EditProp } from '../editTypes'
import { isStrDigitsOnly } from './stringValidatorUtils'

type PhoneExtensionProp = EditProp< string >
const MAX_CHARS = 4

export const phoneExtensionPropCreateStep =
    (propName: string, context: PhoneExtensionProp): PhoneExtensionProp => {

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
export function createPhoneExtensionProp(currRendition: string): PhoneExtensionProp {
    return {
        errors: [],
        createFunc: phoneExtensionPropCreateStep,
        currRendition
    }
}
