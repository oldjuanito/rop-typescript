import { Descriptors } from '../types/primitiveDescriptors'
import { PropertyError, startTrack, RopResult, GOOD, BAD, getErrorsAsString } from '../rop/rop'
import { RequiredShortAnswer } from '../types/requiredShortAnswer'

export interface EditTextFieldDescriptor<T> {
    label: string
    fromRendition: (txtVal: string) => RopResult<T, PropertyError>
}
export interface EditTextFieldCurrVal {
    currTxtVal: string
    currErrors: string[]
}

export function applyTextValue<T>(descriptor: EditTextFieldDescriptor<T>, newVal: string) {
    const result = descriptor.fromRendition(newVal)
    switch (result.kind) {
        case GOOD :
            const goodCurrVal: EditTextFieldCurrVal = { currTxtVal: newVal, currErrors: []}
            return goodCurrVal
        case BAD :
            const badCurrVal: EditTextFieldCurrVal = { 
                currTxtVal: newVal, currErrors: getErrorsAsString([result.error])}
            return badCurrVal
        default:
            const defaultCurrVal: EditTextFieldCurrVal = { currTxtVal: newVal, currErrors: []}
            return defaultCurrVal
    }
}
export function createTxtValueApplier<T>(descriptor: EditTextFieldDescriptor<T>) {
    return (newVal: string) => applyTextValue<T>(descriptor, newVal)
}
