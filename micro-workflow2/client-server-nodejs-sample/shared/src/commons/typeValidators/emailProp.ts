import { ResultForWorkflow } from '../editTypes'
import { fail, pass } from '../rop/rop'

type EmailProp =  string
const MAX_CHARS = 100
export const emailPropCreateStep =
    (propName: string, context: string): ResultForWorkflow<EmailProp> => {
        
        const rawVal = context
        if (rawVal === null || rawVal === '') {
            return fail([
                { propName, errorDescription: `Must not be blank` } ]
            )
        }
        if (rawVal.length > MAX_CHARS) {
            return fail([
                    {propName, errorDescription: `Must not exceed ${MAX_CHARS} characters`}]
            )
        }
        var Regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        if (!Regex.test(rawVal.toLowerCase())) {
            return fail([
                    {propName, errorDescription: `Must be a valid email address`}]
            )
        }
        return pass(rawVal)
    }
