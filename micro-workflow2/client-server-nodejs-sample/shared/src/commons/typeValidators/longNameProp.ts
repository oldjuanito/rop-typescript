import { EditProp } from '../editTypes'

type LongNameProp = EditProp< string >
const MAX_CHARS = 100
export const longNamePropCreateStep =
    (propName: string, context: LongNameProp): LongNameProp => {
        
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
        return ({...context, goodVal: rawVal})
    }
export function createLongNameProp(currRendition: string): LongNameProp {
    return { 
        errors: [], 
        createFunc: longNamePropCreateStep,
        currRendition
    }
}
