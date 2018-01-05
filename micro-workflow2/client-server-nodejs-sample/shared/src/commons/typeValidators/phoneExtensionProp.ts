import {  ResultForWorkflow } from '../editTypes'
import { isStrDigitsOnly } from './stringValidatorUtils'
import { fail, pass } from '../rop/rop'

type PhoneExtensionProp =  string
const MAX_CHARS = 4

export const phoneExtensionPropCreateStep =
    (propName: string, context: string): ResultForWorkflow<PhoneExtensionProp> => {

        const rawVal = context
        if (rawVal === null || rawVal === '') {
            return fail([
                    { propName, errorDescription: `Must not be blank` } ]
            )
        }
        if (rawVal.length > MAX_CHARS) {
            return fail([
                    {propName, errorDescription: `Must not exceed ${MAX_CHARS} digits`}]
            )
        }
        if (!isStrDigitsOnly(rawVal)) {
            return fail([
                    {propName, errorDescription: `Must be digits only`}]
            )
        }
        return pass(rawVal)

    }

