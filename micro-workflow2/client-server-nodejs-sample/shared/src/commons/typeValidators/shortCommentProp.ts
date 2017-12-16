import { EditProp } from '../editTypes'

type ShortCommentProp = EditProp< string >
const MAX_CHARS = 35

export const shortCommentPropCreateStep =
    (optional: boolean, propName: string, context: ShortCommentProp): ShortCommentProp => {

        const rawVal = context.currRendition
     
        if (rawVal === null || rawVal === '') {
            if (optional) {
                return ({...context, goodVal: rawVal})
            } else {
                return {
                    ...context, errors: [
                        {propName, errorDescription: `Must not be blank`}]
                }
            }
        }
        if (rawVal.length > MAX_CHARS) {
            return {...context, errors: [
                    {propName, errorDescription: `Must not exceed ${MAX_CHARS} characters`}]
            }
        }
        return ({...context, goodVal: rawVal})

    }
export function createShortCommentProp(currRendition: string, optional: boolean): ShortCommentProp {
    return {
        errors: [],
        createFunc: (propName: string, context: ShortCommentProp) =>
            shortCommentPropCreateStep(optional, propName, context),
        currRendition
    }
}
