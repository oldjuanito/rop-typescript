import { ResultForWorkflow } from '../editTypes'
import { isStrDigitsOnly } from './stringValidatorUtils'
import { fail, pass } from '../rop/rop'

type BranchNumberProp =  number
const MAX_CHARS = 4

export const branchNumberPropCreateStep =
    (propName: string, context: string): ResultForWorkflow<BranchNumberProp> => {

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
        const numVal = parseInt(rawVal, 0)
        if (isNaN(numVal)) {
            return fail([
                    {propName, errorDescription: `Must be a valid number`}]
            )
        }
        return pass( numVal  )

    }

