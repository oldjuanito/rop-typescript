import { EditProp } from '../editTypes'
import * as bn from 'bignumber.js'

type PositiveNumProp = EditProp< bn.BigNumber >
export const positiveNumCreateStep =
    (propName: string, context: PositiveNumProp): PositiveNumProp => {
        
        const amt = new bn.BigNumber(context.currRendition)
        if (amt.isNaN() || amt.lessThan(0)) {
            return {...context, errors: [
                { propName, errorDescription: `Invalid Number` } ] 
            }
        }
        if (amt.lessThan(0)) {
            return {...context, errors: [
                { propName, errorDescription: `Number must be greater or equal to zero` } ] 
            }
        } else {

            return ({...context, goodVal: amt } )
        }

    }
export function createPositiveNumEditProp(currRendition: string): PositiveNumProp {
    return { 
        errors: [], 
        createFunc: positiveNumCreateStep,
        currRendition
    }
}
