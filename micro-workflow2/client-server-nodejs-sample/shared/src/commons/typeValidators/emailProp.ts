import { EditProp } from '../editTypes'

type EmailProp = EditProp< string >
const MAX_CHARS = 100
export const emailPropCreateStep =
    (propName: string, context: EmailProp): EmailProp => {
        
        const rawVal = context.currRendition
        if (rawVal === null || rawVal === '') {
            return {...context, errors: [
                { propName, errorDescription: `Must not be blank` } ]
            }
        }
        if (rawVal.length > MAX_CHARS) {
            return {...context, errors: [
                    {propName, errorDescription: `Must not exceed ${MAX_CHARS} characters`}]
            }
        }
        var Regex =
            /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        if (!Regex.test(rawVal)) {
            return {...context, errors: [
                    {propName, errorDescription: `Must be a valid email address`}]
            }
        }
        return ({...context, goodVal: rawVal})
    }
export function createEmailProp(currRendition: string): EmailProp {
    return { 
        errors: [], 
        createFunc: emailPropCreateStep,
        currRendition
    }
}
