import { ResultForWorkflow } from '../editTypes'
import { fail, pass } from '../rop/rop'

export type ShortNameRendition = string
export type ShortName = string
const MAX_CHARS = 40
export const shortNamePropCreateStep =
    (propName: string, rendition: ShortNameRendition): ResultForWorkflow<ShortName> => {
        const rawVal = rendition
        if (rawVal === null || rawVal === '') {
            return fail([
                {propName, errorDescription: `Must not be blank`}]
            )
        }
        if (rawVal.length > MAX_CHARS) {
            return fail([
                {propName, errorDescription: `Must not exceed ${MAX_CHARS} characters`}]
            )
        }
        return pass( rawVal)
    }

// export function createShortNameProp(currRendition: string): ShortNameRendition {
//     return {
//         errors: [],
//         createFunc: shortNamePropCreateStep,
//         currRendition
//     }
// }
