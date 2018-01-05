import {  ResultForWorkflow } from '../editTypes'
import { fail, pass } from '../rop/rop'

type AddressLineProp =  string
const MAX_CHARS = 150
export const addressLinePropCreateStep =
    (propName: string, context: string): ResultForWorkflow<AddressLineProp> => {
        
        const rawVal = context
        // if (rawVal === null || rawVal === '') {
        //     return fail([
        //         { propName, errorDescription: `Must not be blank` } ]
        //     )
        // }
        if (rawVal && rawVal.length > MAX_CHARS) {
            return fail([
                    {propName, errorDescription: `Must not exceed ${MAX_CHARS} characters`}]
            )
        }
        return pass(rawVal)
    }