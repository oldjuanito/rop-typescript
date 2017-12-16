import { EditProp } from '../editTypes'

type ShortNameProp = EditProp< string >
const MAX_CHARS = 40
export const shortNamePropCreateStep =
    (propName: string, context: ShortNameProp): ShortNameProp => {
        
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
export function createShortNameProp(currRendition: string): ShortNameProp {
    return { 
        errors: [], 
        createFunc: shortNamePropCreateStep,
        currRendition
    }
}
