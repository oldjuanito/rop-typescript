import {  ResultForWorkflow } from '../editTypes'
import { fail, pass } from '../rop/rop'

type LongNameProp =  string
const MAX_CHARS = 100
export const longNamePropCreateStep =
    (propName: string, context: string): ResultForWorkflow<LongNameProp> => {
        
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
        return pass(rawVal)
    }

