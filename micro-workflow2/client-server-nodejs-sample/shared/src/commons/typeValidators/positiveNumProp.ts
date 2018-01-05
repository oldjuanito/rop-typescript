import {  ResultForWorkflow } from '../editTypes'
import * as bn from 'bignumber.js'
import { fail, pass } from '../rop/rop'

export type PositiveNumProp =  bn.BigNumber
export const positiveNumCreateStep =
    (propName: string, context: string): ResultForWorkflow<PositiveNumProp> => {
        
        const amt = new bn.BigNumber(context)
        if (amt.isNaN() || amt.lessThan(0)) {
            return fail([
                { propName, errorDescription: `Invalid Number` } ] 
            )
        }
        if (amt.lessThan(0)) {
            return fail([
                { propName, errorDescription: `Number must be greater or equal to zero` } ] 
            )
        } else {

            return pass( amt  )
        }

    }

